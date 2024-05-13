import { ContainerScroll } from '@/components/ContainerScroll'
import { FeaturesGrid } from '@/components/Features'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { RocketLaunch, CopySimple, Copy, GithubLogo } from '@phosphor-icons/react/dist/ssr'

export default function Home() {
  return (
    <div className='relative flex h-full w-full flex-col'>
      <Header />
      <div className='flex flex-col max-w-6xl w-full mx-auto items-center justify-center z-10 pt-[100px] gap-10'>

        <div className='text-center flex items-center flex-col gap-5 pt-10'>
          <div className="inline-flex animate-shine items-center justify-center rounded-full  border border-neutral-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-3 py-1 font- text-neutral-400 transition-colors gap-2 ">
            <p>

              Alpha Release Is Live
            </p>
            <RocketLaunch size={20} />
          </div>
          <h1 className='text-9xl uppercase font-black'>Rebox</h1>
          <p className='w-3/4 text-lg text-balance'>Deploy your applications, services, databases with the best DX, with Rebox. A feature rich deployment solution which runs on your infrastructure and gives you complete control of your system. Rebox is a feature packed system, which aims in skipping the figuring out part while deplyments</p>
          <div className='border-2 p-2 px-5 rounded-lg shadow-2xl shadow-neutral-700 font-mono  flex items-center gap-5 text-muted-foreground'>
            curl -fsSL https://rebox.dev/install.sh | sh
            <Copy size={20} />
          </div>
          <div className='flex gap-5 mt-10'>
            <Button className='flex gap-2'>
              <GithubLogo size={20} weight='duotone' />
              Source
            </Button>
            <Button variant={'secondary'}>
              Read The Docs</Button>

          </div>
        </div>
        <ContainerScroll titleComponent={<TitleComponent />}>
          <img src="https://pbs.twimg.com/media/GDE9Au2W0AAMOR9?format=jpg&name=4096x4096" className='object- w-full h-full rounded-xl' alt="" />
        </ContainerScroll>
        <FeaturesGrid />
      </div>
      <div className="base-grid fixed min-h-screen w-screen opacity-40" />
      <div className="fixed bottom-0 min-h-screen w-screen bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
      <Footer />
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
