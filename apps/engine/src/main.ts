import { CronJob } from 'cron';
import { prisma } from './utils'; // Assuming you have prisma set up
import { simpleGit } from 'simple-git'
import { spawn } from 'node:child_process'

let isRunning = false;

const cron = new CronJob('*/10 * * * * *', async () => {
    if (isRunning) {
        console.log('Job is already running, skipping this execution.');
        return;
    }
    const pending = await prisma.queue.findFirst({
        where: {
            status: 'pending',
        }
    });
    if (!pending) {
        console.log('No pending queue, skipping this execution.');
        return;
    }
    isRunning = true;
    const { repo } = pending;
    const git = simpleGit();
    await prisma.queue.update({
        where: {
            id: pending.id,
        },
        data: {
            status: 'cloning',
        },
    });
    await git.clone(pending.repo, './apps/repo');
    await prisma.queue.update({
        where: {
            id: pending.id,
        },
        data: {
            status: 'cloned',
        },
    });
    await prisma.queue.update({
        where: {
            id: pending.id,
        },
        data: {
            status: 'building',
        },
    });
    //build the repo using nixpacks
    const process = spawn('nixpacks', ['build', './apps/repo', '-n', 'app'], {
        stdio: 'inherit', // This option allows you to see the output in your terminal
        shell: true // Optional: to run the command in a shell
    });

    process.on('close', (code) => {
        console.log(`Process exited with code: ${code}`);
    });
    
    isRunning = false;
    await prisma.queue.update({
        where: {
            id: pending.id,
        },
        data: {
            status: 'built',
        },
    });
    console.log('Cloned repo: ', repo);

});

cron.start();
