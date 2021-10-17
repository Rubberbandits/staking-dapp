import React from 'react';
import ReactDOM from 'react-dom';

export default class Error extends React.Component {
	constructor(props) {
		super(props);
	}

	hideError() {
		ReactDOM.unmountComponentAtNode(document.getElementById("error"))
	}

	componentDidMount() {
		if (this.props.isTimed) {
			this.timerID = setTimeout(
				() => this.hideError(),
				5000
			);
		}
	}
	
	componentWillUnmount() {
		if (this.props.isTimed) {
			clearInterval(this.timerID);
		}
	}

    render() {
		return (
			<div className="flex flex-col items-center justify-items-center w-full">
				<div className="alert bg-base-100">
					<div className="flex-1">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2" stroke="#ff5722">    
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>                      
						</svg> 
	
						<label className="mb-0 -mt-0.5 text-xl">{this.props.errorMessage}</label>

						<button className="btn btn-circle btn-sm -mb-2 -mt-0.5 ml-2" onClick={this.hideError}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">   
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>                       
							</svg>
						</button> 
					</div>
				</div>
	
				{this.props.children}
			</div>
		)
	}
}