// 'use client'

// import MemoGameCard from '@/components/memo-game/memo-game-card'
// import { generalStore } from '@/general-store'
// import { AnimatePresence, motion } from 'framer-motion'
// import { useSnapshot } from 'valtio'

// export default function MemoGame() {
//   const generalSnap = useSnapshot(generalStore)

//   return (
//     <AnimatePresence>
//       {generalSnap.showMemoryGame && (
//         <motion.div initial={{ opacity: 0, scaleY: 0.8 }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0, scaleY: 0.8 }} transition={{ duration: 0.2, type: 'spring' }}>
//           <MemoGameCard className='w-fit' props={{}} />
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }
