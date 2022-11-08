import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from "next/head";
import {DAOContextProvider} from "./api/connect";

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>Multisender</title>
      <meta name="description" content="It supports sending ERC20 tokens and ETH!" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <DAOContextProvider>
      <Component {...pageProps} />
    </DAOContextProvider>
    <link rel="stylesheet" href="https://web3camp.us/globals.css"/>
  </>
}

export default MyApp
