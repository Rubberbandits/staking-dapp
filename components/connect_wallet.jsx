import Script from 'next/script'

const ConnectButton = async () => {
	const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
	const account = accounts[0];

	ethereum.selectedAddress = account;

	var walletConnected = new CustomEvent("walletConnected", {detail: account});
	window.dispatchEvent(walletConnected);
}

export default function ConnectWallet()
{
	return (
		<>
			<button className="btn" onClick={ConnectButton}>Connect Wallet</button>
		</>
	)
}