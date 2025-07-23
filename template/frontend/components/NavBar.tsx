import Link from 'next/link'

const NavBar = () => {
  return (
    <nav className='bg-gray-800 p-4'>
      <div className='container mx-auto'>
        <div className='flex items-center gap-4 text-lg font-bold text-white'>
          <span className='text-xl'>SCAF</span>
          <Link href='/'>Home</Link>
          <Link href='/about'>About</Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
