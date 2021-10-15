let CONTRACT_STAKE_ADDR = "0xc6fae0881b7531959ccbe09be58c67718b61f163";
let CONTRACT_NFT_ADDR = "0xdb799f575b9B0f07bd3bfd121b43732d120E7954";

let web3 = new Web3;

function CallContractFunction(_address, _data)
{
	let _promise = new Promise((resolve, reject) => {
		let _payload = web3.eth.abi.encodeFunctionCall(_data.interface, _data.parameters);

		let _requestData = {
			id: 1,
			jsonrpc: "2.0",
			method: "eth_call",
			params: [
				{
					to: _address,
					data: _payload,
				},
				"latest"
			]
		};

		ethereum.request(_requestData)
			.then((_data) => {
				resolve(_data);
			})
			.catch(err => {
				alert(err);
				reject(err);
			});
	});

	return _promise;
}

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

	var dailyRate = document.getElementById("dailyRate");
	dailyRate.innerText = web3.utils.fromWei(rate_day.toString(), "ether");

	var stakedTokens = document.getElementById("stakedTokens");
	stakedTokens.innerText = staked_token_count;

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