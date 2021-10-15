const CONTRACT_ADDR = "0xc6fae0881b7531959ccbe09be58c67718b61f163";

async function GetStakedTokens(account) 
{
	var connectButton = document.getElementById("connectWallet");
	connectButton.style.display = "none";

	var stakingApp = document.getElementById("stakingApp");
	stakingApp.style.display = "flex";


}

window.addEventListener("walletConnected", async function(account) {
	if (account !== undefined) 
	{
		await GetStakedTokens(account);
	}
})