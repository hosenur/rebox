import { Octokit } from "@octokit/rest";
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import React from 'react';
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { auth } from '~/lib/auth.server';
import { prisma } from "~/lib/prisma";
import { Repo } from '~/types';
import { buildQueue } from '@rebox/queues/buildQueue';

export async function action({ request }: ActionFunctionArgs) {
    const body = await request.formData();
    const repo = body.get('repo') as string;
    const headers = new Headers(request.headers);
    const session = await auth.api.getSession({
        headers: headers,
    });
    const account = await prisma.account.findFirst({
        where: {
            userId: session?.user?.id,
        },
    });

    const octokit = new Octokit({
        auth: account?.accessToken,
    });
    const user = await octokit.rest.users.getAuthenticated();
    const repoData = await octokit.rest.repos.get({
        repo: "minimal",
        owner: user.data.login,
    });
    if (!session?.user?.id) {
        return
    }
    const project = await prisma.project.create({
        data: {
            name: uniqueNamesGenerator({
                dictionaries: [adjectives, colors, animals],
                separator: '-',
                length: 2,
            }),
            repoURL: repoData.data.html_url,
            repoName: repoData.data.name,
            userId: session?.user?.id
        }
    })
    await buildQueue.add('build', { project: project });
    console.log(repoData.data);
    return body;
}

export async function loader({ request }: LoaderFunctionArgs) {
    const headers = new Headers(request.headers);
    const session = await auth.api.getSession({
        headers: headers,
    });
    const account = await prisma.account.findFirst({
        where: {
            userId: session?.user?.id,
        },
    });

    const octokit = new Octokit({
        auth: account?.accessToken,
    });

    const repos = await octokit.rest.repos.listForAuthenticatedUser({
        type: 'owner', // Adjust as needed.
    });

    return {
        repos: repos.data,
    };
}

export default function NewProject() {
    const { repos } = useLoaderData<{ repos: Repo[] }>();
    const [open, setOpen] = React.useState(false);
    const [selectedRepo, setSelectedRepo] = React.useState<Repo | null>(null);

    const handleSelect = (repo: Repo) => {
        setSelectedRepo(selectedRepo?.id === repo.id ? null : repo);
        setOpen(false);
    };

    return (
        <div className='flex h-screen items-center justify-center'>
            <Card>
                <CardHeader>
                    <CardTitle>Create Project</CardTitle>
                    <CardDescription>Choose your GitHub repository to continue deploying</CardDescription>
                </CardHeader>
                <CardContent>

                    <Form
                        className="flex flex-col gap-2"
                        method="post"
                    >
                        <Select name="repo">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    repos.map((repo) => {
                                        return <SelectItem value={repo.name}>{repo.name}</SelectItem>
                                    })
                                }
                            </SelectContent>
                        </Select>
                        <Button type='submit'>Deploy</Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
