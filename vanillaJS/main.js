(() => {

	let page = document.getElementById("page");	

	/* DOM Element Generation */

	//mode: {1: flex-box, 0: flex-list}
	let genItem = (currTab, mode) => {
		let {title, id, previewImg, containerId, favIconUrl, url} = currTab;
		
		let flexDiv = document.createElement('div');
		flexDiv.setAttribute('id', containerId + ":" + id);		

		if (typeof previewImg !== 'undefined' || mode === 0) {
			let titleDiv = document.createElement('div');
			let node = document.createTextNode(title);
			titleDiv.appendChild(node);

			flexDiv.setAttribute('class', 'flex-item');
			titleDiv.setAttribute('class', 'item-title');

			let imgDiv = document.createElement('div');
			imgDiv.setAttribute('class', 'previewImg');

			let img = new Image(160, 90);		
			img.src = previewImg;

			imgDiv.appendChild(img);

			flexDiv.appendChild(titleDiv);
			flexDiv.appendChild(imgDiv);			

			flexDiv.addEventListener('click', () => {
				openSelectedTab(currTab, 1);
			});

		} else {
			document.getElementById(containerId + '-Container').className = 'flex-container flexDirection-col';

			flexDiv.setAttribute('class', 'flex-list');

			let wrapDiv = document.createElement('div');			
			wrapDiv.setAttribute('class', 'list-wrap');

			let titleDiv = document.createElement('div');
			titleDiv.setAttribute('class', 'list-title');
			
			let urlDiv = document.createElement('div');
			urlDiv.setAttribute('class', 'list-url');

			let btDiv = document.createElement('a');
			btDiv.setAttribute('class', 'list-BT');
			let linkText = document.createTextNode("Remove");
			btDiv.appendChild(linkText);
			btDiv.addEventListener('click', () => {
				removeSelectedTab(currTab);
			});

			let titleNode = document.createTextNode(title);
			let urlNode = document.createTextNode(url);

			titleDiv.appendChild(titleNode);
			urlDiv.appendChild(urlNode);

			wrapDiv.appendChild(titleDiv);
			wrapDiv.appendChild(urlDiv);

			let iconDiv = document.createElement('div');
			iconDiv.setAttribute('class', 'iconDiv');

			let img = new Image(30, 30);
			img.src = favIconUrl;

			iconDiv.appendChild(img);

			let listItem = document.createElement('div');
			listItem.setAttribute('class', 'list-item');
			listItem.addEventListener('click', () => {
				openSelectedTab(currTab, 1);
			});

			listItem.appendChild(iconDiv);
			listItem.appendChild(wrapDiv);
			flexDiv.appendChild(listItem);			
			flexDiv.appendChild(btDiv);
		}	
		return flexDiv;
	}	

	let genContainer = (key, mode) => {
		let session = document.createElement('div');
		session.setAttribute('id', key);

		let itemsTitle = document.createElement('div');
		itemsTitle.setAttribute('class', 'containerTitle');

		let title = document.createElement('div');
		let nodeStr = key.substring(0, key.indexOf("_")).replace('&', ' ');
		let node = document.createTextNode(nodeStr);
		title.appendChild(node);

		let btsDiv = document.createElement('div');		
		let aOpen = document.createElement('a');
		aOpen.setAttribute('class', 'containerBTs');
		let linkText = document.createTextNode("Open All");
		aOpen.appendChild(linkText);
		aOpen.addEventListener('click', () => {
			openSelectedSession(key);
		});

		let aClear = document.createElement('a');
		aClear.setAttribute('class', 'containerBTs');
		linkText = document.createTextNode("Clear Session");
		aClear.appendChild(linkText);
		aClear.addEventListener('click', () => {
			removeSelectedSession(key);
		});

		itemsTitle.appendChild(title);
		btsDiv.appendChild(aOpen);		
		btsDiv.appendChild(aClear);		
		itemsTitle.appendChild(btsDiv);

		let itemsHolder = document.createElement('div');
		itemsHolder.setAttribute('class', 'clearBoth');
		let hr = document.createElement("HR");
		itemsHolder.appendChild(hr);

		
		let container = document.createElement('div');
		container.setAttribute('class', 'flex-container');
		container.setAttribute('id', key + '-Container');
		
		itemsHolder.appendChild(container);

		session.appendChild(itemsTitle);
		session.appendChild(itemsHolder);

		return session;
	}

	/* Store Tabs: */

	let storeCurrTab = (tab, opt) => {		
		if (tab === null) {
			chrome.tabs.getSelected(null, (currTab) => {				
				captureTab(currTab, opt);
			});
		} else {
			captureTab(tab, opt);			
		}		
	}

	// opt: {1: keep open, 0: navi, -1: close}
	let captureTab = (currTab, opt) => {

		let resizeImg = (url, cb) => {	
			let ret = null;
			let img = new Image();
			img.src = url;
			img.width = 160;
			img.height = 90;
			
			let canvas = document.createElement('canvas'),
					ctx = canvas.getContext('2d');						
			canvas.width = 160;
			canvas.height = 90;
			img.onload = () => {			
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				ret = canvas.toDataURL('image/jpeg', 0.95);		
				cb(ret);
			}
		}

		let date = new Date();
		let id = date.getFullYear() + "-" + date.getMonth() + 
					"-" + date.getDate() + "&" + date.getHours() + ":" + date.getMinutes()
					+ "_" + currTab.windowId;

		currTab.storedTime = id;

		let key = date.getFullYear() + "-" + date.getMonth() + 
					"-" + date.getDate() + "_" + currTab.windowId;

		checkDuplicate(key, currTab, (cb) => {
			let index = -1,
					mode = 0,
					arr = null;
			if (cb !== null) {
				index = cb.index;
				arr = cb.arr;
				mode = cb.mode;
			}

			if (index < 0) {
				arr = arr === null ? [] : arr;
				chrome.tabs.captureVisibleTab(currTab.windowId, {quality: 95}, (url) => {
					resizeImg(url, (cb) => {
						if (mode === 0) {
							currTab.previewImg = cb;
						}
						currTab.containerId = key;
						let item = genItem(currTab, mode);
						let container = document.getElementById(key + "-Container");

						if (container === null) {
							page.appendChild(genContainer(key, mode));
							container = document.getElementById(key + "-Container");
						}
						arr.push(currTab);
						let val = {
							mode: mode,
							tabs: arr
						}
						chrome.storage.local.set({[key]: val}, () => {
							container.appendChild(item);													
							if (opt === -1) {
								closeSelectedTab(currTab);			
							} else if (opt === 0) {
								chrome.tabs.update({
	   							url: "./popup.html"
								});								
							}
						});										
					});
				});
			} else {

			}						
		});
	}

	let storeAllTabs = () => {
		chrome.tabs.query({currentWindow: true}, (tabs) => {
			if (tabs.length === 0) return;
			let date = new Date();
			let key = date.getFullYear() + "-" + date.getMonth() + 
						"-" + date.getDate() + "_" + tabs[0].windowId;
			let arr = [];

			tabs.forEach((tab, index) => {				
				let isExtension = tab.url.indexOf('chrome-extension://') >= 0;
				if (!isExtension) {			
					tab.containerId = key;
					arr.push(tab);
				}
				if (tab.highlighted === false) closeSelectedTab(tab);	
			});
			let val = {
				mode: 1,
				tabs: arr
			}			
			chrome.storage.local.set({[key]: val}, () => {
				chrome.tabs.update({
     			url: "./popup.html"
				});
				if (window.location.hash === '#popup') {
					window.close();
				}
			});
		});
	}


	/* Open Tabs: */

	let openSelectedTab = (currTab, opt) => {
		let id = currTab.containerId;	

		chrome.storage.local.get(id, (session) => {			
			let arr = session[id].tabs;
			arr.forEach((tab, index) => {
				if (tab.url === currTab.url) {
					arr.splice(index, 1);
					if (arr.length === 0) {
						chrome.storage.local.remove(id, () => {
							if (opt === 1) {
								createTab(currTab);
							}
						});
					} else {
						let val = {
							mode: session.mode,
							tabs: arr							
						}
						chrome.storage.local.set({[id]: val}, () => {
							if (opt === 1) {							
								createTab(currTab);		
							}		
						});
					}	
					document.getElementById(id + ":" + currTab.id).remove();
					let container = document.getElementById(id + "-Container");
					if (!container.hasChildNodes()) {
						document.getElementById(id).remove();			
					}	
				}
			});								
		});
	}

	let openSelectedSession = (key) => {
		checkDuplicate(key, null, (cb) => {
			if (cb === null) return;
			let { arr } = cb;
			arr.forEach((tab) => {
				createTab(tab);
			});
			chrome.storage.local.remove(key, () => {
				document.getElementById(key).remove();
			})
		});
	}

	let openAllTabs = () => {
		chrome.storage.local.get(null, (sessions) => {
			console.log(sessions);			
			for (session in sessions.tabs) {
				let keys = sessions[session];
				for (key in Object.keys(keys)) {
					let currTab = keys[key];
					let id = currTab.containerId;
					chrome.tabs.create({
						url: currTab.url,
						active: false
					});
					document.getElementById(id + ":" + currTab.id).remove();
					let container = document.getElementById(id + "-Container");
					if (!container.hasChildNodes()) {
						document.getElementById(id).remove();			
					}
				}
			}
			removeAllTabsFunc();
		});
	}

	/* Close and Remove Tabs: */

	let closeSelectedTab = (currTab) => {
		chrome.tabs.remove(currTab.id);
	}

	let removeSelectedTab = (currTab) => {
		openSelectedTab(currTab, 0);
	}

	let removeSelectedSession = (key) => {
		chrome.storage.local.remove([key], () => {
			document.getElementById(key).remove();
		});
	}

	let removeAllTabs = () => {
		chrome.storage.local.clear();
		chrome.storage.sync.clear();
		document.getElementById('page').innerHTML = '';
	}


	/* Helper functions: */

	// return {index, arr, mode} || null
	let checkDuplicate = (key, currTab, callback) => {
		chrome.storage.local.get([key], (obj) => {			
			let arr = [];
			let mode = 0;
			if (!isEmpty(obj)) {
				arr = Object.keys(obj[key].tabs).map((e) => {
					return obj[key]['tabs'][e];
				});
				mode = obj[key].mode;
			} else {
				return callback(null);				
			}

			let index = -1;
			if (currTab !== null) {				
				arr.forEach((storedTab, i) => {
					if (storedTab.title === currTab.title 
							&& storedTab.url === currTab.url) {
						index = i;					
					}
				});
			}
			return callback({'index': index, 'arr': arr, 'mode': mode});
		});
	}

	let isEmpty = (obj) => {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) return false;
		}
		return true;
	}

	let openPopupWindow = () => {
		let popupWindow = window.open(
			chrome.extension.getURL("tabSpork.html"),
			"tabSpork",
		);
	}

	let createTab = (currTab) => {
		chrome.tabs.create({
			url: currTab.url,
			active: false
		});
	}

	let showBTs = () => {
		document.getElementById('storeAllTabsBT').setAttribute('class', 'button');		
	}

	let hideBTs = () => {
		chrome.tabs.query({currentWindow: true}, (tabs) => {
			if (tabs.length === 1 && tabs[0].url.indexOf('chrome-extension://') >= 0) {
				document.getElementById('storeAllTabsBT').setAttribute('class', 'button hidden');
				document.getElementById('storeCurrTabBT').setAttribute('class', 'button hidden');		
			}
			chrome.tabs.getSelected(null, (currTab) => {
				if (currTab.url.indexOf('chrome-extension://') >= 0) {
					document.getElementById('storeCurrTabBT').setAttribute('class', 'button hidden');
					document.getElementById('openWindowBT').setAttribute('class', 'button hidden');
				}
			});
		});
	}


	/* Initialize Page: */

	let initPage = () => {
		if (window.location.hash === '#popup') {			
			let html = document.getElementsByTagName('html')[0];
			let body = document.getElementsByTagName('body')[0];

			html.setAttribute('class', 'popup');
			body.setAttribute('class', 'popup');

			chrome.windows.getLastFocused({windowTypes: ["normal"]}, (currWindow) => {
				if (currWindow.width < 768) {
					let width = currWindow.width * 0.7;
					html.style.width = width + "px";
					body.style.width = width + "px";
				}
			});
		}

		chrome.storage.local.get(null, (sessions) => {
			//console.log(sessions);
			for (session in sessions) {
				let mode = sessions[session].mode;
				let keys = sessions[session].tabs;

				page.appendChild(genContainer(session, mode));
				let container = document.getElementById(session + "-Container");

				for (key in Object.keys(keys)) {
					let currTab = keys[key];
					container.appendChild(genItem(currTab, mode));
				}
			}				
		});

		hideBTs();		
	}


	/* Self-Run functions onload: */

	initPage();
	document.getElementById('storeCurrTabBT').addEventListener('click', () => {
		storeCurrTab(null, 1);
	});
	document.getElementById('storeAllTabsBT').addEventListener('click', storeAllTabs);
	document.getElementById('openAllBT').addEventListener('click', openAllTabs)
	document.getElementById('clearAllBT').addEventListener('click', removeAllTabs);
	document.getElementById('openWindowBT').addEventListener('click', openPopupWindow);

	chrome.tabs.onCreated.addListener(showBTs);
	chrome.tabs.onAttached.addListener(showBTs);
	chrome.tabs.onRemoved.addListener(hideBTs);
	chrome.tabs.onDetached.addListener(hideBTs);

})();
