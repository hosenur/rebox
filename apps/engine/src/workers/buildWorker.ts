import { Worker } from "bullmq";
import simpleGit from "simple-git";
import { prisma } from "../utils";
import { buildNixPacks, runApp } from "../build";
import { exec, spawn } from "child_process";
export const buildWorker = new Worker("build", async (job) => {
    console.log("Step 1: Build Started")
    console.log("Project: ", job.data.project)
    const queue = await prisma.queue.create({
        data: {
            projectId: job.data.project.id,
            status: 'cloning',
        }
    })
    console.log("Step 2: Cloning Repo")
    const git = simpleGit();
    await git.clone(job.data.project.repoURL, `/home/hosenur/${job.data.project.name}`);
    console.log("Step 3: Cloned Repo")
    await prisma.queue.update({
        where: {
            id: queue.id,
        },
        data: {
            status: 'building',
        },
    });
    await buildNixPacks(`/home/hosenur/${job.data.project.name}`,job.data.project.name);
    console.log("Step 4: Build Completed")
    runApp(job.data.project.name);

},
    {

        autorun: false,
        connection: {
            host: 'localhost',
            port: 6379,
        },
    }
);