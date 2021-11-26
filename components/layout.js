import Head from 'next/head'
import Link from 'next/link'

import Insta from './icons/instagram'
import Twitter from './icons/twitter'
import Email from './icons/email'

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
            <h1 className="text-2xl my-0"><Link href="/"><a><span className="text-gray-500">leonardmartin</span><span className="text-red-500">.photo</span></a></Link></h1>
            <nav className="flex flex-0 items-center text-gray-500">
              <Link href="/about"><a className="ml-4 hidden sm:inline">About me</a></Link>
              <Link href="/galleries"><a className="ml-4 hidden sm:inline">Galleries</a></Link>
              <Basket className="ml-4" />
            </nav>
          </header>
        )
      }
      {
        pageProps.header === false && (
          <header className="py-6 flex justify-end items-center">
            <nav className="flex items-center text-gray-500 text-right">
              <Basket className="ml-4" />
            </nav>
          </header>
        )
      }
      <main>
        { children }
      </main>
      <footer className="flex items-center justify-between mt-8 border-t py-6">
        <p className="mb-0">&copy; Leonard Martin</p>
        <p className="mb-0 flex">
          <a href="mailto:info@leonardmartin.photo" className="ml-2"><Email size={24} /></a>
          <a href="https://instagram.com/lennygoesoutside" className="ml-2"><Twitter size={24} /></a>
          <a href="https://twitter.com/lennym" className="ml-2"><Insta size={24} /></a>
        </p>

      </footer>
    </div>
  )
}
