// Includes
import Script from 'next/script'
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import ReactDOM from 'react-dom'

// Components

import ConnectWallet from '../components/connect_wallet'
import TokenContainer from '../components/token_container'
import StakingStats from '../components/staking_stats'

const Error = dynamic(() => import('../components/error'), {
	ssr: false
})

// Helper Functions
const AllowStakingApproval = async () => {
	let txHash = await CreateTransaction(CONTRACT_NFT_ADDR, '0x00', {
		interface: {
			name: 'setApprovalForAll',
			type: 'function',
			inputs: [
				{
					type: "address",
					name: "owner"
				},
				{
					type: "bool",
					name: "approved"
				}
			]
		},
		parameters: [CONTRACT_STAKE_ADDR, true]
	});

	ReactDOM.unmountComponentAtNode(document.getElementById("error"))
}

const DetectContractApproval = () => {
	window.addEventListener("needsContractApproval", async function(e) {
		ReactDOM.render(
			<Error errorMessage="The staking contract doesn't have approval from this wallet to manage tokens!">
				<button className="btn w-full mt-2" onClick={(e) => {e.stopPropagation(); AllowStakingApproval()}}>Allow</button>
			</Error>, 
			document.getElementById("error")
		);
	});
}

export default function Home() {
  	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<Head>
				<title>Nautilus Staking</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js" strategy="beforeInteractive"/>
			<Script src="https://unpkg.com/@metamask/detect-provider/dist/detect-provider.min.js" strategy="beforeInteractive" />
			<Script src="/init_app.js" strategy="beforeInteractive" />
			<Script type="module" strategy="afterInteractive" src="/connect_wallet.js" />

			<div id="error" className="mb-2"></div>

			<div>
				<Script strategy="afterInteractive" src="/staked_tokens.js"/>

				<svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" id="loading">
					<path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
					</path>
				</svg>

				{process.browser && DetectContractApproval()}

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