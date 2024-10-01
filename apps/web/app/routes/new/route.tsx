import { Octokit } from "@octokit/rest";
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import React from 'react';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { auth } from '~/lib/auth.server';
import { prisma } from "~/lib/prisma";
import { Repo } from '~/types';
export async function action({ request }: ActionFunctionArgs) {
    const body = await request.formData();
    const repo = body.get('repo') as string;
    await prisma.queue.create({
        data:{
            repo: repo,
        }
    })
    console.log(body);
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
            <div className='w-96 border'>
                <Form
                    method="post"
                >
                    <Input name="repo" placeholder="Repository" />
                    <Button type='submit'>Deploy</Button>
                </Form>
            </div>
        </div>
    );
}
