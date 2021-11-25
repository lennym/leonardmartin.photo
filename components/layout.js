import Head from 'next/head'
import Link from 'next/link'

import Basket from './basket'

export default function Layout({ children, ...pageProps }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 ">
      <Head>
        <title>leonardmartin.photo</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        pageProps.header !== false && (
          <header className="py-6 border-b mb-8 flex justify-between items-center">
            <h1 className="text-xl my-0"><Link href="/"><a><span className="text-gray-500">leonardmartin</span><span className="text-red-500">.photo</span></a></Link></h1>
            <nav className="flex flex-0 items-center text-gray-500">
              <Link href="/about"><a className="ml-4 hidden sm:inline">About me</a></Link>
              <Link href="/galleries"><a className="ml-4 hidden sm:inline">Galleries</a></Link>
              <Basket className="ml-4" />
            </nav>
          </header>
        )
      }
      <main>
        { children }
      </main>
      <footer className="flex items-center mt-8 border-t py-6">
        <p className="mb-0">&copy; Leonard Martin</p>
      </footer>
    </div>
  )
}
