const CONTRACT_STAKE_ADDR = "0x5435450adcedcbf56fd5934c97b522da284ef7e8";
const CONTRACT_NFT_ADDR = "0xdb799f575b9B0f07bd3bfd121b43732d120E7954";
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