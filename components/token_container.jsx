import dynamic from 'next/dynamic'
import ReactDOM from 'react-dom'

const TokenDisplay = dynamic(() => import('./token_display'), {
	ssr: false
})

const GetAllTokens = async (account) => {
	let tokens = [];

	let owned_tokens_encoded = await CallContractFunction(CONTRACT_NFT_ADDR, {
		interface: {
			name: 'balanceOf',
			type: 'function',
			inputs: [
				{
					type: "address",
					name: "owner"
				}
			]
		},
		parameters: [account]
	});
	let owned_tokenCount = web3.eth.abi.decodeParameter("uint256", owned_tokens_encoded);

	let promises = [];
	for (let i = 0; i < owned_tokenCount; i++) {
		promises.push(
			CallContractFunction(CONTRACT_NFT_ADDR, {
				interface: {
					name: 'tokenOfOwnerByIndex',
					type: 'function',
					inputs: [
						{
							type: "address",
							name: "owner"
						},
						{
							type: "uint256",
							name: "index"
						}
					]
				},
				parameters: [account]
			})
		);
	}

	let owned_tokens = [];
	await Promise.allSettled(promises)
		.then(results => {
			results.forEach(result => owned_tokens.push(web3.eth.abi.decodeParameter("uint256", result.value)))
		})

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
	let all_tokens = owned_tokens.concat(staked_tokens);

	for await (const tokenID of all_tokens) {
		let token_uri_encoded = await CallContractFunction(CONTRACT_NFT_ADDR, {
			interface: {
				name: 'tokenURI',
				type: 'function',
				inputs: [
					{
						type: "uint256",
						name: "tokenId"
					}
				]
			},
			parameters: [tokenID]
		});

		let tokenURI = new URL(web3.eth.abi.decodeParameter("string", token_uri_encoded))
		if (tokenURI.protocol == "ipfs:") {
			let path = "/ipfs/" + tokenURI.pathname.slice(2);

			tokenURI.protocol = "https:";
			tokenURI.hostname = "cloudflare-ipfs.com";
			tokenURI.pathname = path;
		}

		await fetch(tokenURI)
			.then(response => response.json())
			.then(_data => {
				tokens.push({
					tokenID: tokenID,
					isStaked: staked_tokens.includes(tokenID),
					image: _data.image
				})
			})
			.catch(_err => {
				tokens.push({
					tokenID: tokenID,
					isStaked: staked_tokens.includes(tokenID),
					image: "/default.png"
				})
				
				console.log("Uh oh, can't fetch token image! "+ tokenID);
			});
	}

	return tokens;
}

const CreateTokenDisplays = () => {
	window.addEventListener("walletConnected", async function(e) {
		let account = e.detail;
		let tokens = await GetAllTokens(account);
		let token_displays = [];
		
		tokens.forEach(_data => {
			token_displays.push(<TokenDisplay tokenID={_data.tokenID} isStaked={_data.isStaked} imagePath={_data.image} />);
		});

		let tokenList = document.getElementById("tokenList");
		tokenList.classList.remove("justify-center");

		let loading = tokenList.querySelector("#loading");
		if (loading) { 
			loading.classList.add("hidden");
		}

		ReactDOM.render(
			<> 
				{token_displays}
			</>, document.getElementById("tokenList")
		)
	});
}

const GetSelectedTokens = () => {
	let tokenList = document.getElementById("tokenList")
	let selected_tokens = [];

	tokenList.childNodes.forEach(el => {
		let selected = el.querySelector("#select").classList.contains("bg-white");
		if (!selected) return

		selected_tokens.push(el);
	})

	return selected_tokens;
}

const Error = dynamic(() => import('../components/error'), {
	ssr: false
})

const StakeSelected = async (e) => {
	let selected_tokens = GetSelectedTokens();
	if (selected_tokens.length == 0) {
		ReactDOM.render(
			<Error errorMessage="You haven't selected any tokens!" />, 
			document.getElementById("error")
		);

		return;
	}

	let is_staked = false;
	let token_ids = [];

	selected_tokens.forEach(el => {
		if (el.querySelector("#isStaked").innerText == "Staked") {
			is_staked = true
		}

		token_ids.push(el.querySelector("#tokenID").innerText.slice(1))
	});

	if (is_staked) {
		ReactDOM.render(
			<Error errorMessage="You have staked tokens selected!" />, 
			document.getElementById("error")
		);

		return;
	}

	let txHash = await CreateTransaction(CONTRACT_STAKE_ADDR, '0x00', {
		interface: {
			name: 'deposit',
			type: 'function',
			inputs: [
				{
					type: "uint256[]",
					name: "tokenIds"
				},
			]
		},
		parameters: [token_ids]
	});
}

const UnstakeSelected = async (e) => {
	let selected_tokens = GetSelectedTokens();
	if (selected_tokens.length == 0) {
		ReactDOM.render(
			<Error errorMessage="You haven't selected any tokens!" />, 
			document.getElementById("error")
		);

		return;
	}

	let not_staked = false;
	let token_ids = [];

	selected_tokens.forEach(el => {
		if (el.querySelector("#isStaked").innerText != "Staked") {
			not_staked = true
		}

		token_ids.push(el.querySelector("#tokenID").innerText.slice(1))
	});

	if (not_staked) {
		ReactDOM.render(
			<Error errorMessage="You have unstaked tokens selected!" />, 
			document.getElementById("error")
		);

		return;
	}

	let txHash = await CreateTransaction(CONTRACT_STAKE_ADDR, '0x00', {
		interface: {
			name: 'withdraw',
			type: 'function',
			inputs: [
				{
					type: "uint256[]",
					name: "tokenIds"
				},
			]
		},
		parameters: [token_ids]
	});
}

export default function TokenContainer() 
{
	return (
		<>
			<div id="tokenList" className="rounded-md bg-base-100 flex flex-row p-2 space-x-3 w-full max-w-5xl overflow-auto mt-2 justify-center">
				<svg width="20" height="20" fill="currentColor" className="flex mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" id="loading">
					<path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
					</path>
				</svg>
				
				{process.browser && CreateTokenDisplays()}
			</div>

			<div className="shadow stats border border-base-300 overflow-visible mt-2 w-full">
				<div className="stat place-items-center">
					<div className="btn-group w-full">
						<button className="btn btn-outline btn-lg w-1/2" onClick={StakeSelected}>
							Deposit
						</button>

						<button className="btn btn-outline btn-lg w-1/2" onClick={UnstakeSelected}>
							Withdraw
						</button>
					</div>
				</div>
			</div>
		</>
	)
}