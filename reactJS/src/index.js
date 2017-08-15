import React from 'react';
import { render } from 'react-dom';

import Buttons from './components/Buttons';
import TabLists from './components/TabLists';

import store from './store';

(() => {
	console.log("Asdasdaj");
	chrome.tabs.getSelected(null, (currTab) => {
		let url =  currTab.url;
		if (url.indexOf('chrome-extension://') >= 0 || url.indexOf('chrome://') >= 0 || url.indexOf('/chrome/newtab?') >= 0) {
			store.buttons[0] = 0;			
		}
	});
	chrome.tabs.query({currentWindow: true}, (tabs) => {
		let result = 0;
		tabs.forEach((tab) => {
			let url = tab.url;
			if (url.indexOf('chrome-extension://') < 0 && url.indexOf('chrome://') < 0 && url.indexOf('/chrome/newtab?') < 0) {
				result = 1;
				return;
			}
		});
		store.buttons[1] = result;
	});
})();

render(
	<div>
		<Buttons store={store} />
		<TabLists store={store} />
	</div>, 
	document.getElementById('app')
);
