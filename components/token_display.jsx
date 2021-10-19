import Script from 'next/script'
import Image from 'next/image'

const ToggleSelect = (e) => {
	var btn = e.target;
	btn.classList.toggle("bg-white");
	btn.classList.toggle("text-black");
	btn.innerText = btn.classList.contains("bg-white") && "Selected" || "Select";
}

export default function TokenDisplay({tokenID, isStaked, imagePath})
{
	return (
		<div className="card bordered rounded-md bg-neutral-content min-w-max">
			<figure className="px-1 pt-1">
				<Image width="256" height="256" src={imagePath} className="rounded-md" />
			</figure>

			<div className="card-body p-2 pt-0 flex-row min-w-full justify-between">
				<div className="flex flex-col">
					<h5 id="tokenID" className="card-title text-neutral m-0">#{tokenID}</h5>
					<h5 id="isStaked" className="text-neutral">{isStaked && "Staked" || "Not staked"}</h5>
				</div>

				<button id="select" className="btn btn-md self-center w-24" onClick={ToggleSelect}>
					Select
				</button>
			</div>
		</div>
	)	
}