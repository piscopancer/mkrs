'use client'

import { layoutStore } from '@/app/layout'
import Bamboo from '@/assets/illustrations/bamboo.svg'
import Dragon from '@/assets/illustrations/dragon.svg'
import Flower from '@/assets/illustrations/flower.svg'
import Girl from '@/assets/illustrations/girl.svg'
import Lamps from '@/assets/illustrations/lamps.svg'
import Pagoda from '@/assets/illustrations/pagoda.svg'
import Pagoda1 from '@/assets/illustrations/pagoda1.svg'
import Pagoda2 from '@/assets/illustrations/pagoda2.svg'
import Plant from '@/assets/illustrations/plant.svg'
import Ship from '@/assets/illustrations/ship.svg'
import Tower from '@/assets/illustrations/tower.svg'
import Tree from '@/assets/illustrations/tree.svg'
import clsx from 'clsx'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ComponentProps } from 'react'
import { useSnapshot } from 'valtio'

export default function Background(props: ComponentProps<'div'>) {
  const layoutSnap = useSnapshot(layoutStore)
  const { scrollY } = useScroll({ container: layoutSnap.mainContainer ?? undefined })

  return (
    <div {...props} about='background' className={clsx(props.className)}>
      <motion.div
        className='absolute inset-0'
        style={{
          y: useTransform(() => scrollY.get() * 0.7),
        }}
      >
        <BambooBg />
      </motion.div>
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900' />
    </div>
  )
}

function PagodaBg() {
  return <Pagoda className='absolute right-0 top-[10%] h-full [&_*]:fill-zinc-800' />
}

function Pagoda1Bg() {
  return <Pagoda1 className='absolute right-1/4 h-[120%] [&_*]:fill-zinc-800' />
}

function Pagoda2Bg() {
  return <Pagoda2 className='absolute left-1/2 top-[-10%] h-[120%] [&_*]:fill-zinc-800' />
}

function TreeBg() {
  return <Tree className='absolute right-1/3 top-[-10%] h-[150%] fill-zinc-800' />
}

function TowerBg() {
  return <Tower className='absolute left-1/4 top-[-10%] h-[120%] fill-zinc-800' />
}

function ShipBg() {
  return <Ship className='absolute bottom-0 left-1/3 h-[90%] fill-zinc-800' />
}

function BambooBg() {
  return <Bamboo className='absolute left-1/4 top-[-10%] h-[120%] fill-zinc-800' />
}

function DragonBg() {
  return <Dragon className='absolute left-1/3 top-[-10%] h-[150%] fill-zinc-800' />
}

function FlowerBg() {
  return <Flower className='absolute right-1/3 h-[100%] fill-zinc-800' />
}

function LampsBg() {
  return <Lamps className='absolute right-1/4 top-[-10%] h-[130%] fill-zinc-800' />
}
function GirlBg() {
  return <Girl className='absolute left-1/2 top-[-10%] h-[130%] fill-zinc-800 max-md:-translate-x-1/3' />
}
function PlantBg() {
  return <Plant className='absolute left-1/4 top-[-10%] h-[120%] fill-zinc-800 max-md:-translate-x-1/3' />
}
