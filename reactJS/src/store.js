import { observable, autorun } from 'mobx';

class Store {
	@observable sessions = [{id: "2017-8-14_93"}];
	@observable buttons = [1, 1, 0, 1];
}

let store = window.store = new Store;

export default store;
