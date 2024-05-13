import { ContainerScroll } from '@/components/ContainerScroll'
import Header from '@/components/Header'
import { RocketLaunch } from '@phosphor-icons/react/dist/ssr'
import React from 'react'

export default function Home() {
  return (
    <div className='relative flex h-full w-full flex-col'>
      <Header />
      <div className='flex flex-col max-w-6xl w-full mx-auto items-center justify-center z-10 pt-[100px]'>
        <div className="inline-flex animate-shine items-center justify-center rounded-full  border border-neutral-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-3 py-1 font- text-neutral-400 transition-colors gap-2 ">
          <p>

          Alpha Release Is Live 
          </p>
          <RocketLaunch size={20} />


        </div>
        <ContainerScroll titleComponent={<TitleComponent />}>
          <img src="https://pbs.twimg.com/media/GDE9Au2W0AAMOR9?format=jpg&name=4096x4096" className='object- w-full h-full rounded-xl' alt="" />
        </ContainerScroll>
      </div>
      <div className="base-grid fixed min-h-screen w-screen opacity-40" />
      <div className="fixed bottom-0 min-h-screen w-screen bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
    </div>
  )
}
const TitleComponent = () => {
  return (
    <div>
      <h1 className="text-5xl md:text-8xl  font-bold inline-flex animate-shine bg-[linear-gradient(110deg,#939393,40%,#fff,60%,#939393)] bg-[length:200%_100%] text-transparent bg-clip-text">
        Cakewalked
      </h1>
      <h1 className="text-5xl md:text-8xl  font-bold text-[#939393]">
        Deployments
      </h1>
    </div>
  )
}
