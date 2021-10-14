const provider = await detectEthereumProvider();

if (provider) {
	let loadingModal = document.getElementById("loading");
	loadingModal.style.display = "none";

	let connectButton = document.getElementById("connectWallet");
	connectButton.style.display = "flex";
	connectButton.style.flexDirection = "column"
} else {
	alert('Please install MetaMask!');
}