"use client";
import { Copy, Copyright, DiscordLogo, GithubLogo, InstagramLogo, X, XLogo } from '@phosphor-icons/react';
import React from 'react'
import Marquee from 'react-fast-marquee'
export default function Footer() {
    return (
        <footer className='mt-20'>
            <Marquee autoFill className='overflow-visible -z-10 -mb-9'>
                <h1 className='text-8xl font-bold mx-5'>rebox.dev</h1>
            </Marquee>
            <div className='glass  z-10'>
                <div className='max-w-6xl mx-auto py-20'>

                    <div className='flex justify-between'>
                        <div>
                            <h1 className='font-semibold text-xl'>rebox.dev</h1>
                            <p className='text-muted-foreground flex items-center gap-1 text-sm mt-1'>
                                <Copyright size={18} className='white' />
                                <span>Copyright 2024 Rebox</span>
                            </p>
                            <div className='mt-5 text-muted-foreground flex gap-2.5'>
                                <GithubLogo size={20} />
                                <InstagramLogo size={20} />
                                <XLogo size={20} />
                                <DiscordLogo size={20} />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 text-muted-foreground'>
                            <h1>Documentation</h1>
                            <h1>Blog</h1>
                            <h1>Changelogs</h1>
                            <h1>FAQ</h1>
                            <h1>Roadmap</h1>
                        </div>

                    </div>

                </div>

            </div>
        </footer>
    )
}
