import Script from 'next/script'

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
						<button id="claimTokens" className="btn btn-outline btn-lg w-32">
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