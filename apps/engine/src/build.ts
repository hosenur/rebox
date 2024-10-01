import { spawn } from 'node:child_process';
import dockerode from 'dockerode';


export const buildNixPacks = (path: string,imageName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const process = spawn('nixpacks', ['build', path, '-n', imageName], {
            stdio: 'inherit', // Allows you to see the output in your terminal
            shell: true // Optional: to run the command in a shell
        });

        process.on('error', (err) => {
            console.error('Failed to start process:', err);
            reject(err); // Reject the Promise on error
        });

        process.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Process exited with code: ${code}`);
                reject(new Error(`Process failed with exit code ${code}`)); // Reject the Promise on failure
            } else {
                console.log('Process completed successfully.');
                resolve(); // Resolve the Promise on success
            }
        });
    });
};


export const runApp = async (image: string) => {
    const docker = new dockerode();
    const container = await docker.createContainer({
        Image: image,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        ExposedPorts: {
            '3000/tcp': {}
        },
        HostConfig: {
            PortBindings: {
                '3000/tcp': [
                    {
                        HostPort: '3000'
                    }
                ]
            }
        }
    });

    // Start the container
    await container.start();

}
