import Script from 'next/script'

export default function StakingStats()
{
	return (
		<>
			<Script strategy="beforeInteractive" src="/get_staked_stats.js"/>

			<div className="w-full shadow stats border border-base-300 overflow-visible">
				<div className="stat place-items-center place-content-center">
					<div className="stat-title">Staked Tokens</div> 
					<div id="stakedTokens" className="stat-value">0</div>
				</div> 
				<div className="stat place-items-center place-content-center">
					<div className="stat-title">Estimated $COIN/day</div> 
					<div id="dailyRate" className="stat-value">0</div> 
				</div> 
				<div className="stat place-items-center place-content-center">
					<div className="stat-title">Unclaimed $COIN</div> 
					<div id="waitingReward" className="stat-value">0</div> 
				</div>

				<button id="refreshStats" className="btn h-full">
					Refresh
				</button>
			</div>
		</>
	)	
}