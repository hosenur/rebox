import { spawn } from 'node:child_process';
import dockerode from 'dockerode';

export const buildNixPacks = (path: string): void => {
    const process = spawn('nixpacks', ['build', path, '-n', 'app'], {
        stdio: 'inherit', // Allows you to see the output in your terminal
        shell: true // Optional: to run the command in a shell
    });

    process.on('error', (err) => {
        console.error('Failed to start process:', err);
    });

    process.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Process exited with code: ${code}`);
        } else {
            console.log('Process completed successfully.');
        }
    });
};

export const runApp = async (image: string) => {

}
