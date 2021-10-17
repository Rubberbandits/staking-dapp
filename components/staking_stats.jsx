import Script from 'next/script'

const ClaimRewards = async () => {
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
		parameters: [ethereum.selectedAddress]
	});
	let staked_tokens = web3.eth.abi.decodeParameter("uint256[]", staked_tokens_encoded);

	let txHash = await CreateTransaction(CONTRACT_STAKE_ADDR, '0x00', {
		interface: {
			name: 'claimRewards',
			type: 'function',
			inputs: [
				{
					type: "uint256[]",
					name: "tokenIds"
				},
			]
		},
		parameters: [staked_tokens]
	});
}

export default function StakingStats()
{
	return (
		<>
			<Script strategy="beforeInteractive" src="/get_staked_stats.js"/>

			<div className="w-full shadow stats border border-base-300 overflow-visible mt-2">
				<div className="stat place-items-center place-content-center">
					<div className="stat-title">Staked Tokens</div> 
					<div id="stakedTokens" className="stat-value">0</div>
				</div> 
				<div data-tip="This is an estimation assuming 6600 blocks mined per day." className="stat place-items-center place-content-center tooltip">
					<div className="stat-title">Estimated $PYRAMID/day</div> 
					<div id="dailyRate" className="stat-value">0</div> 
				</div> 
				<div className="stat place-items-center place-content-center">
					<div className="stat-title">Unclaimed $PYRAMID</div> 
					<div id="waitingReward" className="stat-value">0</div> 
				</div>

				<div className="stat place-items-center">
					<div className="btn-group">
						<button id="claimTokens" className="btn btn-outline btn-lg w-32" onClick={ClaimRewards}>
							Claim
						</button>

						<button id="refreshStats" className="btn btn-outline btn-lg w-32">
							Refresh
						</button>
					</div>
				</div>
			</div>
		</>
	)	
}