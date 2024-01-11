import '@/assets/styles/style.scss'
import Search from '@/components/search'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Search className='mt-[20vh]' />

      {children}
    </>
  )
}
