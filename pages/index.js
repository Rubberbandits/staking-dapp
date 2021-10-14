import Script from 'next/script'
import Head from 'next/head'
import StakedTokens from '../components/staked_tokens'

export default function Home() {
  return (
    <div data-theme="nautilus" className="flex flex-col items-center justify-center min-h-screen py-2">
		<Head>
			<title>Nautilus Staking</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>

		<Script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js" strategy="beforeInteractive"/>
		<Script src="https://unpkg.com/@metamask/detect-provider/dist/detect-provider.min.js" strategy="beforeInteractive" />
		<Script type="module" strategy="afterInteractive" src="/connect_wallet.js" />

		<StakedTokens />
    </div>
  )
}