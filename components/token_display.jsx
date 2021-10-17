import Script from 'next/script'
import Image from 'next/image'

const ToggleSelect = (e) => {
	var btn = e.target;
	btn.classList.toggle("btn-active");
}

export default function TokenDisplay({tokenID, isStaked})
{
	return (
		<div id="token-display-template" className="card bordered rounded-md bg-neutral-content min-w-max">
			<figure className="px-1 pt-1">
				<Image width="256" height="256" src="/nautilus.gif" className="rounded-md" />
			</figure>

			<div className="card-body p-2 pt-0 flex-row min-w-full justify-between">
				<div className="flex flex-col">
					<h5 className="card-title text-neutral m-0">Token #{tokenID}</h5>
					<h5 className="text-neutral">{isStaked && "Staked" || "Not staked"}</h5>
				</div>

				<button className="btn btn-md self-center" onClick={ToggleSelect}>
					Select
				</button>
			</div>
		</div>
	)	
}