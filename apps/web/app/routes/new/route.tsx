import { LoaderFunctionArgs } from '@remix-run/node'
import React from 'react'
import { Octokit } from "@octokit/rest";
import { auth, prisma } from '~/lib/auth.server';
export async function loader({ request }: LoaderFunctionArgs) {
    const headers = new Headers(request.headers);
    const session = await auth.api.getSession({
        headers: headers
    })
    const account  = await prisma.account.findFirst({
        where: {
            userId: session?.user?.id
        }
    })
    const octokit = new Octokit({
        auth: account?.accessToken
    })
    const repos = await octokit.rest.repos.listForAuthenticatedUser({
        type: 'all'
    })
    return {
        repos: repos.data
    }
}
export default function NewProject() {
    return (
        <div>NewProject</div>
    )
}
