'use client'

import { ease } from '@/utils'
import { ValueAnimationTransition, animate, transform, useMotionValue } from 'framer-motion'
import { MutableRefObject, useEffect, useState } from 'react'

function getBoundingOffset(el: HTMLElement) {
  return {
    top: (el.getBoundingClientRect().top / innerHeight) * 100 + '%',
    right: 100 - (el.getBoundingClientRect().right / innerWidth) * 100 + '%',
    bottom: 100 - (el.getBoundingClientRect().bottom / innerHeight) * 100 + '%',
    left: (el.getBoundingClientRect().left / innerWidth) * 100 + '%',
  }
}

type Offset = string

type UseExpansionProps = {
  initialRef: MutableRefObject<HTMLElement>
  expanderRef: MutableRefObject<HTMLElement>
  offsets?: {
    top: Offset
    right: Offset
    bottom: Offset
    left: Offset
  }
  transition?: (base: ValueAnimationTransition) => ValueAnimationTransition
  onExpandStart?: () => void | Promise<void>
  onExpandComplete?: () => void | Promise<void>
  onShrinkStart?: () => void | Promise<void>
  onShrinkComplete?: () => void | Promise<void>
}

const baseTransition: ValueAnimationTransition = { duration: 0.7, ease: [...ease] }

export default function useExpansion({
  offsets = {
    top: '0%',
    right: '0%',
    bottom: '0%',
    left: '0%',
  },
  ...props
}: UseExpansionProps) {
  const [expanded, setExpanded] = useState(false)
  const [animating, setAnimating] = useState(false)
  const expandMV = useMotionValue(0)

  // useEffect(() => {
  //   debugStore.exp_animating = animating
  //   debugStore.exp_expanded = expanded
  // })

  useEffect(() => {
    expandMV.on('change', (v) => {
      // debugStore.exp_progress = Number(v.toFixed(1))
      if (!props.expanderRef || !props.initialRef.current) return
      const offset = getBoundingOffset(props.initialRef.current)
      props.expanderRef.current.style.top = transform(v, [0, 1], [offset.top, offsets.top])
      props.expanderRef.current.style.right = transform(v, [0, 1], [offset.right, offsets.right])
      props.expanderRef.current.style.bottom = transform(v, [0, 1], [offset.bottom, offsets.bottom])
      props.expanderRef.current.style.left = transform(v, [0, 1], [offset.left, offsets.left])
    })
    expandMV.on('animationStart', () => setAnimating(true))
    expandMV.on('animationCancel', () => setAnimating(false))
    expandMV.on('animationComplete', () => {
      setAnimating(false)
    })
    return () => {
      expandMV.destroy()
    }
  }, [])

  function changeSize(expand: boolean) {
    if (!props.initialRef.current || !props.expanderRef) return
    if (expand) {
      props.onExpandStart?.()
      props.initialRef.current.tabIndex = -1
      props.initialRef.current.style.opacity = '0'
      props.initialRef.current.style.pointerEvents = 'none'
      props.expanderRef.current.style.display = 'initial'
      const offset = getBoundingOffset(props.initialRef.current)
      props.expanderRef.current.style.top = offset.top
      props.expanderRef.current.style.right = offset.right
      props.expanderRef.current.style.bottom = offset.bottom
      props.expanderRef.current.style.left = offset.left
    } else {
      props.onShrinkStart?.()
    }
    animate(expandMV, expand ? 1 : 0, props.transition?.(baseTransition) || baseTransition).then(() => {
      setExpanded(expand)
      if (!expand) {
        props.onShrinkComplete?.()
        props.initialRef.current.tabIndex = 0
        props.initialRef.current.style.opacity = '1'
        props.initialRef.current.style.pointerEvents = 'auto'
        props.expanderRef.current.style.display = 'none'
      } else {
        props.onExpandComplete?.()
      }
    })
  }

  function expand() {
    if (!expanded || animating) changeSize(true)
  }

  function shrink() {
    if (expanded || animating) changeSize(false)
  }

  return { expandMV, expand, shrink, expanded, animating }
}
