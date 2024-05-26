'use client'

import { layoutStore } from '@/app/layout'
import { backgrounds } from '@/assets/bg'
import Bamboo from '@/assets/bg/bamboo.svg'
import Dragon from '@/assets/bg/dragon.svg'
import Flower from '@/assets/bg/flower.svg'
import Girl from '@/assets/bg/girl.svg'
import Girl1 from '@/assets/bg/girl1.svg'
import Lamps from '@/assets/bg/lamps.svg'
import Pagoda from '@/assets/bg/pagoda.svg'
import Pagoda1 from '@/assets/bg/pagoda1.svg'
import Pagoda2 from '@/assets/bg/pagoda2.svg'
import Panda from '@/assets/bg/panda.svg'
import Plant from '@/assets/bg/plant.svg'
import Ship from '@/assets/bg/ship.svg'
import Tower from '@/assets/bg/tower.svg'
import Tree from '@/assets/bg/tree.svg'
import Tree1 from '@/assets/bg/tree1.svg'
import { generalStore } from '@/stores/general'
import { getShuffledArray } from '@/utils'
import clsx from 'clsx'
import { getDayOfYear } from 'date-fns'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ComponentProps, ReactNode, useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'

const backgroundsInfo = {
  none: { component: () => null },
  bamboo: { component: BambooBg },
  panda: { component: PandaBg },
  dragon: { component: DragonBg },
  girl: { component: GirlBg },
  girl1: { component: Girl1Bg },
  lamps: { component: LampsBg },
  ship: { component: ShipBg },
  tower: { component: TowerBg },
  tree: { component: TreeBg },
  tree1: { component: Tree1Bg },
  plant: { component: PlantBg },
  flower: { component: FlowerBg },
  pagoda: { component: PagodaBg },
  pagoda1: { component: Pagoda1Bg },
  pagoda2: { component: Pagoda2Bg },
} as const satisfies Record<(typeof backgrounds)[number], { component: () => ReactNode }>

export default function Background(props: ComponentProps<'div'>) {
  const layoutSnap = useSnapshot(layoutStore)
  const generalSnap = useSnapshot(generalStore)
  const [mobile, setMobile] = useState(true)
  const { scrollY } = useScroll({ container: layoutSnap.mainContainer ?? undefined })
  const Bg = backgroundsInfo[generalSnap.autoChangeBackground ? getShuffledArray(backgrounds, getDayOfYear(new Date()))[0] : generalSnap.background].component

  useEffect(() => {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (mobile) setMobile(false)
  }, [])

  return (
    <div {...props} about='background' className={clsx(props.className)}>
      <motion.div
        key={generalSnap.background}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='absolute inset-0 min-h-full max-md:aspect-[1/1.5] max-md:w-full'
        style={{
          y: useTransform(() => scrollY.get() * (mobile ? 0.7 : 0)),
        }}
      >
        <Bg />
      </motion.div>
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900' />
    </div>
  )
}

function PagodaBg() {
  return <Pagoda className='absolute right-0 top-[10%] h-full [&_*]:fill-zinc-800' />
}

function Pagoda1Bg() {
  return <Pagoda1 className='absolute right-1/4 h-[120%] max-md:left-2/3 max-md:-translate-x-1/2 [&_*]:fill-zinc-800' />
}

function Pagoda2Bg() {
  return <Pagoda2 className='absolute left-1/2 top-[-10%] h-[120%] max-md:left-2/3 max-md:-translate-x-1/2 [&_*]:fill-zinc-800' />
}

function TreeBg() {
  return <Tree className='absolute right-[10%] top-[-10%] h-[150%] fill-zinc-800 max-md:-right-1/4' />
}

function Tree1Bg() {
  return <Tree1 className='absolute left-0 h-[100%] fill-zinc-800' />
}

function TowerBg() {
  return <Tower className='absolute left-1/4 top-[-10%] h-[120%] fill-zinc-800' />
}

function ShipBg() {
  return <Ship className='absolute bottom-0 left-1/3 h-[90%] fill-zinc-800 max-md:left-0' />
}

function BambooBg() {
  return <Bamboo className='absolute left-1/4 top-[-10%] h-[120%] fill-zinc-800' />
}

function DragonBg() {
  return <Dragon className='absolute left-1/3 top-[-10%] h-[150%] fill-zinc-800 max-md:left-2/3 max-md:-translate-x-1/2' />
}

function FlowerBg() {
  return <Flower className='absolute right-1/3 h-[100%] fill-zinc-800 max-md:right-0' />
}

function Girl1Bg() {
  return <Girl1 className='absolute right-1/3 h-[100%] fill-zinc-800 max-md:right-0' />
}

function PandaBg() {
  return <Panda className='absolute left-1/3 h-[100%] fill-zinc-800 max-md:left-1/2 max-md:-translate-x-1/2' />
}

function LampsBg() {
  return <Lamps className='absolute right-1/4 top-[-10%] h-[130%] fill-zinc-800 max-md:-right-1/4' />
}

function GirlBg() {
  return <Girl className='absolute left-1/2 top-[-10%] h-[130%] fill-zinc-800 max-md:-translate-x-1/3' />
}

function PlantBg() {
  return <Plant className='absolute left-1/4 top-[-10%] h-[120%] fill-zinc-800 max-md:-translate-x-1/3' />
}
