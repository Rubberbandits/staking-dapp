import dynamic from 'next/dynamic'
import ReactDOM from 'react-dom'

const TokenDisplay = dynamic(() => import('./token_display'), {
	ssr: false
})

const GetAllTokens = async (account) => {
	let tokens = [];

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

		await fetch("/1.json")
			.then(response => response.json())
			.then(_data => {
				tokens.push({
					tokenID: tokenID,
					isStaked: staked_tokens.includes(tokenID),
					image: _data.image
				})
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
			token_displays.push(<TokenDisplay tokenID={_data.tokenID} isStaked={_data.isStaked} imagePath={_data.image} />)
		});

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
		let selected = el.querySelector("#select").classList.contains("btn-accent");
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
			<div id="tokenList" className="rounded-md bg-base-100 flex flex-row p-2 space-x-3 w-full max-w-5xl overflow-auto mt-2">
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