import React from 'react'
import { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"

import Navbar from '../components/Navbar';


import '../app/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return ( <SessionProvider session={pageProps.session}>
    <Navbar />
    <Component {...pageProps} />
  </SessionProvider>)
//   <Component {...pageProps} />
}

export default MyApp;