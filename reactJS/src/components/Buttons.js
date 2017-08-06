import React from 'react';

export default class Buttons extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 'tab',
			avail: [1, 1, 0, 1],
		}
	}

	render() {
		return(
			<div id='buttons'>
				
			</div>
		);
	}
}
