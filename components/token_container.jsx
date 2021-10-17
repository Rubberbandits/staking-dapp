import dynamic from 'next/dynamic'
import ReactDOM from 'react-dom'

const TokenDisplay = dynamic(() => import('./token_display'), {
	ssr: false
})

const CreateTokenDisplays = () => {
	window.addEventListener("walletConnected", async function(e) {
		let account = e.detail;

		let owned_tokens_encoded = await CallContractFunction(CONTRACT_NFT_ADDR, {
			interface: {
				name: 'walletOfOwner',
				type: 'function',
				inputs: [
					{
						type: "address",
						name: "_owner"
					}
				]
			},
			parameters: [account]
		});
		let owned_tokens = web3.eth.abi.decodeParameter("uint256[]", owned_tokens_encoded);

		let staked_tokens_encoded = await CallContractFunction(CONTRACT_STAKE_ADDR, {
			interface: {
				name: 'depositsOf',
				type: 'function',
				inputs: [
					{
						type: "address",
						name: "account"
					}
				]
			},
			parameters: [account]
		});
		let staked_tokens = web3.eth.abi.decodeParameter("uint256[]", staked_tokens_encoded);

		let token_displays = [];
		owned_tokens.forEach(tokenID => {
			token_displays.push(<TokenDisplay tokenID={tokenID} isStaked={false}/>)
		});
		staked_tokens.forEach(tokenID => {
			token_displays.push(<TokenDisplay tokenID={tokenID} isStaked={true}/>)
		});

		//<TokenDisplay tokenID={1} isStaked={false}/>

		ReactDOM.render(
			<> 
				{token_displays}
			</>, document.getElementById("tokenList")
		)
	});
}

const StakeSelected = (e) => {

}

const UnstakeSelected = (e) => {

}

export default function TokenContainer() 
{
	return (
		<>
			<div id="tokenList" className="rounded-md bg-base-100 flex flex-row p-2 space-x-3 w-full max-w-5xl overflow-auto mt-2">
				{process.browser && CreateTokenDisplays()}
			</div>

			<div className="shadow stats border border-base-300 overflow-visible mt-2 w-full">
				<div className="stat place-items-center">
					<div className="btn-group w-full">
						<button className="btn btn-outline btn-lg w-1/2" onClick={StakeSelected}>
							Stake
						</button>

						<button className="btn btn-outline btn-lg w-1/2" onClick={UnstakeSelected}>
							Unstake
						</button>
					</div>
				</div>
			</div>
		</>
	)
}