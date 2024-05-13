import { Features } from '@/components/Features'
import Hero from '@/components/Hero'
import Preview from '@/components/Preview'

export default function Home() {
  return (
    <div className='relative flex h-full w-full'>
      <div className='max-w-6xl mx-auto flex w-full gap-10 flex-col py-10 z-10 p-5'>
        <Hero />
        <Features/>
        <Preview/>

      </div>
      <div className="base-grid fixed min-h-screen w-screen opacity-40" />
      <div className="fixed bottom-0 min-h-screen w-screen bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
    </div>
  )
}

