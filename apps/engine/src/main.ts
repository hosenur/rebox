import { CronJob } from 'cron';
import { prisma } from './utils'; // Assuming you have prisma set up
import { simpleGit } from 'simple-git'

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
    const { repo } = pending;
    const git = simpleGit();
    await git.clone(pending.repo, './tmp');
    await prisma.queue.update({
        where: {
            id: pending.id,
        },
        data: {
            status: 'cloning',
        },
    });
    console.log('Cloned repo: ', repo);

});

cron.start();
