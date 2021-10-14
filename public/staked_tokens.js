async function GetStakedTokens(account) 
{
	var connectButton = document.getElementById("connectWallet");
	connectButton.style.display = "none";
}

window.addEventListener("walletConnected", async function(account) {
	if (account !== undefined) 
	{
		await GetStakedTokens(account);
	}
})