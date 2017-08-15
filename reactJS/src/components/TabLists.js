import React from 'react';

import ListTitle from './ListTitle';
import ListItem from './ListItem';

export default class TabLists extends React.Component {

	render() {
		return(
			<div>
				<ListTitle session={this.props.store.sessions[0]} />
			</div>
		);
	}

}
