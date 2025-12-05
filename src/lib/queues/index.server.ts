import { Queue, Worker } from "bullmq";
import { getPort } from "get-port-please";
import { prisma } from "@/lib/prisma.server";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

export type BuildJobData = {
  projectId: string;
  deploymentId: string;
  projectName: string;
  projectPath: string;
  userId: string;
};

export type DeployJobData = {
  projectId: string;
  deploymentId: string;
  projectName: string;
  projectPath: string;
  imageName: string;
  userId: string;
};

// Queues
export const buildQueue = new Queue<BuildJobData>("build", { connection });
export const deployQueue = new Queue<DeployJobData>("deploy", { connection });

// Build Worker
export const buildWorker = new Worker<BuildJobData>(
  "build",
  async (job) => {
    const { projectPath, projectName, userId, deploymentId } = job.data;
    const imageName = `rebox-${userId}-${projectName}`.toLowerCase();

    console.log(`Building project: ${projectName} at ${projectPath}`);

    // Update deployment status
    await prisma.deployment.update({
      where: { id: deploymentId },
      data: { status: "building", buildJobId: job.id },
    });

    let lineNumber = 0;

    try {
      const proc = Bun.spawn(
        ["railpack", "build", "--name", imageName, projectPath],
        {
          env: { ...process.env, BUILDKIT_HOST: "docker-container://buildkit" },
          stdout: "pipe",
          stderr: "pipe",
        }
      );

      // Stream stdout
      const stdoutReader = proc.stdout.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await stdoutReader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim()) {
            lineNumber++;
            await prisma.buildLog.create({
              data: {
                deploymentId,
                line: lineNumber,
                message: line,
              },
            });
          }
        }
      }

      // Handle remaining buffer
      if (buffer.trim()) {
        lineNumber++;
        await prisma.buildLog.create({
          data: {
            deploymentId,
            line: lineNumber,
            message: buffer,
          },
        });
      }

      await proc.exited;

      if (proc.exitCode !== 0) {
        throw new Error(`Build failed with exit code ${proc.exitCode}`);
      }

      console.log(`Build completed for ${projectName}, image: ${imageName}`);

      // Update deployment
      await prisma.deployment.update({
        where: { id: deploymentId },
        data: { imageName },
      });

      // Add to deploy queue
      const deployJob = await deployQueue.add("deploy", {
        ...job.data,
        imageName,
      });

      await prisma.deployment.update({
        where: { id: deploymentId },
        data: { deployJobId: deployJob.id },
      });

      return { success: true, imageName };
    } catch (error) {
      console.error(`Build failed for ${projectName}:`, error);

      await prisma.deployment.update({
        where: { id: deploymentId },
        data: { status: "failed" },
      });

      throw error;
    }
  },
  { connection }
);

// Deploy Worker
export const deployWorker = new Worker<DeployJobData>(
  "deploy",
  async (job) => {
    const { projectName, imageName, userId, deploymentId } = job.data;

    console.log(`Deploying project: ${projectName}`);

    // Update deployment status
    await prisma.deployment.update({
      where: { id: deploymentId },
      data: { status: "deploying" },
    });

    let lineNumber = 0;

    const addDeployLog = async (message: string) => {
      lineNumber++;
      await prisma.deployLog.create({
        data: {
          deploymentId,
          line: lineNumber,
          message,
        },
      });
    };

    try {
      // Get an available port
      const port = await getPort({ portRange: [3001, 4000] });
      await addDeployLog(`Assigned port ${port}`);

      // Run the container
      const containerName = `rebox-${userId}-${projectName}`.toLowerCase();

      // Stop and remove existing container if it exists
      await addDeployLog(`Removing existing container if any...`);
      const removeProc = Bun.spawn(["docker", "rm", "-f", containerName], {
        stdout: "pipe",
        stderr: "pipe",
      });
      await removeProc.exited;

      // Run new container
      await addDeployLog(`Starting container ${containerName}...`);
      const runProc = Bun.spawn(
        [
          "docker",
          "run",
          "-d",
          "--name",
          containerName,
          "-p",
          `${port}:${port}`,
          "-e",
          `PORT=${port}`,
          imageName,
        ],
        {
          stdout: "pipe",
          stderr: "pipe",
        }
      );

      await runProc.exited;

      if (runProc.exitCode !== 0) {
        const stderr = await new Response(runProc.stderr).text();
        throw new Error(`Docker run failed: ${stderr}`);
      }

      await addDeployLog(`Container started successfully on port ${port}`);

      // Update deployment
      await prisma.deployment.update({
        where: { id: deploymentId },
        data: {
          status: "running",
          containerName,
          port,
        },
      });

      console.log(`Deployed ${projectName} on port ${port}`);

      return { success: true, port, containerName };
    } catch (error) {
      console.error(`Deploy failed for ${projectName}:`, error);

      await addDeployLog(
        `Deploy failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );

      await prisma.deployment.update({
        where: { id: deploymentId },
        data: { status: "failed" },
      });

      throw error;
    }
  },
  { connection }
);

// Graceful shutdown
process.on("SIGTERM", async () => {
  await buildWorker.close();
  await deployWorker.close();
});
