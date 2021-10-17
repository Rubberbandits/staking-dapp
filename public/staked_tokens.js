async function DisplayStakingApp(account) 
{
	let is_approved_encoded = await CallContractFunction(CONTRACT_NFT_ADDR, {
		interface: {
			name: 'isApprovedForAll',
			type: 'function',
			inputs: [
				{
					type: "address",
					name: "owner"
				},
				{
					type: "address",
					name: "operator"
				}
			]
		},
		parameters: [account, CONTRACT_STAKE_ADDR]
	})

	let is_approved = web3.eth.abi.decodeParameter("bool", is_approved_encoded);
	if (is_approved !== true) 
	{
		var contractNotApproved = document.getElementById("contractNotApproved");
		contractNotApproved.style.display = "flex";

		var connectButton = document.getElementById("connectWallet");
		connectButton.style.display = "none";
	} else {
		var connectButton = document.getElementById("connectWallet");
		connectButton.style.display = "none";
	
		var stakingApp = document.getElementById("stakingApp");
		stakingApp.style.display = "flex";
	}

	ethereum.on('accountsChanged', (accounts) => window.location.reload());
}

window.addEventListener("walletConnected", async function(e) {
	if (e.detail !== undefined) 
	{
		await DisplayStakingApp(e.detail);
	}
})