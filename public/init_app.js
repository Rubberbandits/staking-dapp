const CONTRACT_STAKE_ADDR = "0xEF19Fe9cbAbE8410D903a4Cd3173aE28b61bc7e7";
const CONTRACT_NFT_ADDR = "0x1a4C4B22fA54b65A0BCE5F4eA4a33378c007726E";
const web3 = new Web3;

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
				alert(err.message);
				reject(err);
			});
	});

	return _promise;
}

function CreateTransaction(_address, _value, _data)
{
	let _promise = new Promise((resolve, reject) => {
		let _payload = web3.eth.abi.encodeFunctionCall(_data.interface, _data.parameters);

		let _requestData = {
			method: "eth_sendTransaction",
			params: [
				{
					from: ethereum.selectedAddress,
					to: _address,
					value: _value,
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
				alert(err.message);
				reject(err);
			});
	});

	return _promise;
}

ethereum.on('chainChanged', (_chainId) => window.location.reload());