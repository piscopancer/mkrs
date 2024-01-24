import logo from '@/assets/logo.png'
import womanCat from '@/assets/woman-thinks-she-is-a-cat.gif'
import { Tooltip } from '@/components/tooltip'
import { project } from '@/project'
import { objectEntries } from '@/utils'
import { Metadata } from 'next'
import Image from 'next/image'
import { IconType } from 'react-icons'
import { GiCat } from 'react-icons/gi'
import { TbBrandGmail, TbBrandTelegram } from 'react-icons/tb'

export const metadata: Metadata = {
  title: `Информация — ${project.name}`,
}

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  const socials = {
    telegram: { text: 'Мой телеграм', icon: TbBrandTelegram },
    email: { text: 'Моя почта', icon: TbBrandGmail },
  } satisfies Partial<Record<keyof typeof project.creator.links, { text: string; icon: IconType }>>

  return (
    <main className='max-w-screen-lg mx-auto'>
      <header className='mt-12 grid grid-cols-[12rem,1fr] grid-rows-[1fr,auto] gap-x-8 gap-y-4 mb-20 max-md:block'>
        <Image alt='логотип' src={logo} className='saturate-0 row-span-2 rounded-full outline-2 outline-offset-[6rem] outline-zinc-800/50 outline max-md:w-1/2 max-md:mb-8' draggable={false} />
        <h1 className='self-end font-display text-5xl relative max-md:text-3xl max-md:mb-4'>{project.name}</h1>
        <h2 className='text-zinc-400 relative'>{project.description}</h2>
      </header>
      <article data-mdx className='relative mb-32'>
        {children}
      </article>
      <footer className='border-t-2 border-zinc-800 py-12 mb-12 flex items-center relative max-md:grid max-md:grid-cols-2 max-md:gap-y-4'>
        <span className='mr-4 font-display'>{project.name}</span>
        <span className='mr-auto max-md:text-sm'>2024</span>
        <span className='mr-8 max-md:text-sm'>@{project.creator.nickname}</span>
        <ul className='flex items-center gap-4'>
          {objectEntries(socials).map(([id, social], i) => (
            <Tooltip key={i} content={social.text}>
              <a target='_blank' href={project.creator.links[id]} className='w-12 h-12 rounded-full flex items-center justify-center bg-zinc-800 hover:bg-zinc-700'>
                <social.icon className='stroke-zinc-200 h-6' />
              </a>
            </Tooltip>
          ))}
        </ul>
        <Tooltip className='!p-0' content={<Image alt='женщина думает, что она кошка' src={womanCat} className='w-48 rounded-[inherit]' />}>
          <GiCat className='absolute bottom-[92%] max-md:bottom-[95%] left-[10%] h-12' />
        </Tooltip>
      </footer>
    </main>
  )
}
