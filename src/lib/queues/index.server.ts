import { Queue, Worker } from "bullmq";
import { $ } from "bun";
import { getPort } from "get-port-please";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

export type BuildJobData = {
  projectId: string;
  projectName: string;
  projectPath: string;
  userId: string;
};

export type DeployJobData = {
  projectId: string;
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
    const { projectPath, projectName, userId } = job.data;
    const imageName = `rebox-${userId}-${projectName}`.toLowerCase();

    console.log(`Building project: ${projectName} at ${projectPath}`);

    try {
      // Run railpack build with BUILDKIT_HOST env
      await $`BUILDKIT_HOST=docker-container://buildkit railpack build --name ${imageName} ${projectPath}`.quiet();

      console.log(`Build completed for ${projectName}, image: ${imageName}`);

      // Add to deploy queue
      await deployQueue.add("deploy", {
        ...job.data,
        imageName,
      });

      return { success: true, imageName };
    } catch (error) {
      console.error(`Build failed for ${projectName}:`, error);
      throw error;
    }
  },
  { connection }
);

// Deploy Worker
export const deployWorker = new Worker<DeployJobData>(
  "deploy",
  async (job) => {
    const { projectName, imageName, userId } = job.data;

    console.log(`Deploying project: ${projectName}`);

    try {
      // Get an available port
      const port = await getPort({ portRange: [3001, 4000] });

      console.log(`Assigned port ${port} for ${projectName}`);

      // Run the container
      const containerName = `rebox-${userId}-${projectName}`.toLowerCase();

      // Stop and remove existing container if it exists
      await $`docker rm -f ${containerName}`.quiet().nothrow();

      // Run new container
      await $`docker run -d --name ${containerName} -p ${port}:${port} -e PORT=${port} ${imageName}`.quiet();

      console.log(`Deployed ${projectName} on port ${port}`);

      return { success: true, port, containerName };
    } catch (error) {
      console.error(`Deploy failed for ${projectName}:`, error);
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
