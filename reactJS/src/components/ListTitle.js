import React from 'react';

export default class ListTitle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	render() {
		let id = this.props.session.id;
		let title = id.substring(0, id.indexOf("_"));
		return(
			<div>
				{title}
			</div>
		);
	}
}
