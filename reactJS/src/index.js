import React from 'react';
import { render } from 'react-dom';

import Buttons from './components/Buttons';
import TabLists from './components/TabLists';

render(
		<div>
			{ Buttons }
			{ TabLists }
		</div>
	, document.getElementById('app')
);
