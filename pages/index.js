import Script from 'next/script'
import Head from 'next/head'
import Image from 'next/image'

// Components

import ConnectWallet from '../components/connect_wallet'
import TokenContainer from '../components/token_container'
import StakingStats from '../components/staking_stats'

// allow staking contract to manage your tokens
const AllowStakingApproval = () => {

}

export default function Home() {
  return (
    <div data-theme="nautilus" className="flex flex-col items-center justify-center min-h-screen py-2">
		<Head>
			<title>Nautilus Staking</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>

		<Script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js" strategy="beforeInteractive"/>
		<Script src="https://unpkg.com/@metamask/detect-provider/dist/detect-provider.min.js" strategy="beforeInteractive" />
		<Script src="/init_app.js" strategy="beforeInteractive" />
		<Script type="module" strategy="afterInteractive" src="/connect_wallet.js" />

		<div>
			<div id="error" className="alert bg-base-100 hidden">
				<div className="flex-1">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2" stroke="#ff5722">    
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>                      
					</svg> 

					<label className="mb-0 -mt-0.5 text-xl">Generic Error</label>
				</div>
			</div>

			<div id="contractNotApproved" className="hidden flex-col items-center w-full">
				<div id="error" className="alert bg-base-100">
					<div className="flex-1">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2" stroke="#ff5722">    
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>                      
						</svg> 

						<label className="mb-0 -mt-0.5 text-xl">You need to allow the staking contract to manage your tokens!</label>
					</div>
				</div>

				<button className="btn w-full mt-2" onClick={AllowStakingApproval}>Allow</button>
			</div>

			<Script strategy="afterInteractive" src="/staked_tokens.js"/>

			<svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" id="loading">
				<path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
				</path>
			</svg>

			<div id="connectWallet" className="hidden">
				<Image width="500" height="500" src="/wgmi-p-500.png"/>
				<ConnectWallet />
			</div>

			<div id="stakingApp" className="hidden flex-col items-center">
				<StakingStats />
				<TokenContainer />
			</div>
		</div>
    </div>
  )
}