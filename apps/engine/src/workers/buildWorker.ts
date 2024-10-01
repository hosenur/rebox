import { Worker } from "bullmq";
import simpleGit from "simple-git";
import { prisma } from "../utils";
import { buildNixPacks } from "../build";
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
    exec('touch ok.txt', (error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        if (error) {
            console.log(`exec error: ${error}`);
        }
    });
    buildNixPacks(`/home/hosenur/${job.data.project.name}`);
},
    {

        autorun: false,
        connection: {
            host: 'localhost',
            port: 6379,
        },
    }
);