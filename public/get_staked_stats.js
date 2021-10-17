async function GetStakedStats(account)
{
	var staked_tokens_encoded = await CallContractFunction(CONTRACT_STAKE_ADDR, {
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
	let staked_token_count = staked_tokens.length;

	var rewards_encoded = await CallContractFunction(CONTRACT_STAKE_ADDR, {
		interface: {
			name: 'calculateRewards',
			type: 'function',
			inputs: [
				{
					type: "address",
					name: "account"
				},
				{
					type: "uint256[]",
					name: "tokenIds",
				}
			]
		},
		parameters: [account, staked_tokens]
	});

	let rewards = web3.eth.abi.decodeParameter("uint256[]", rewards_encoded);
	let totalRewards = 0;

	rewards.forEach(reward => {
		totalRewards += parseInt(reward, 10);
	});

	var rate = await CallContractFunction(CONTRACT_STAKE_ADDR, {
		interface: {
			name: 'rate',
			type: 'function',
			inputs: []
		},
		parameters: []
	});

	let rate_day = (web3.eth.abi.decodeParameter("uint256", rate) * 6600) * staked_token_count;

	var stakedTokens = document.getElementById("stakedTokens");
	stakedTokens.innerText = staked_token_count;

	var dailyRate = document.getElementById("dailyRate");
	dailyRate.innerText = web3.utils.fromWei(rate_day.toString(), "ether");

	var waitingReward = document.getElementById("waitingReward");
	waitingReward.innerText = web3.utils.fromWei(totalRewards.toString(), "ether");
}

window.addEventListener("walletConnected", async function(e) {
	if (e.detail !== undefined) 
	{
		await GetStakedStats(e.detail);

		document.getElementById("refreshStats").addEventListener("click", async function() {
			await GetStakedStats(e.detail);
		});
	}
})