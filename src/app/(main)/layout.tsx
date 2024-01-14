import Search from '@/components/search'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='max-w-screen-lg mx-auto'>
      <Search className='mt-24 mb-12' />
      {children}
    </div>
  )
}
