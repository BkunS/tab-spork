import React from 'react';
import { observer } from 'mobx-react';

@observer 
export default class Buttons extends React.Component {	

	render() {
		const disableSC = this.props.store.buttons[0] === 0 ? true : false;
		const disableSA = this.props.store.buttons[1] === 0 ? true : false;
		const disableCA = this.props.store.buttons[2] === 0 ? true : false;
		const disableOP = this.props.store.buttons[3] === 0 ? true : false;

		const handleSC = () => {

		}

		const handleSA = () => {

		}

		const handleCA = () => {

		}

		const handleOP = () => {
			console.log(window.location.href)
			let popupWindow = window.open(
				chrome.extension.getURL("tabSpork.html"),
				"TabSpork",
			);
		}

		return(
			<div id='buttons'>
				<button disabled={disableSC} onClick={handleSC}> StoreCurrent </button>
				<button disabled={disableSA} onClick={handleSA}> StoreAll </button>
				<button disabled={disableCA} onClick={handleCA}> ClearAll </button>
				<button disabled={disableOP} onClick={handleOP}> OpenPopup </button>
			</div>
		);
	}
}
