import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/Popup/App'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import storeCreatorFactory from 'reduxed-chrome-storage';
import reducers from './reducers';
import {TonClient} from "@tonclient/core";
import {libWeb, libWebSetup} from "@tonclient/lib-web";

(async () => {

    TonClient.useBinaryLibrary(libWeb);
    const storeName = "s3"
    const persistedState = localStorage.getItem(storeName)
        ? JSON.parse(localStorage.getItem(storeName))
        : {}
    const store = chrome.storage == null ? createStore(reducers, persistedState) : await storeCreatorFactory({createStore})(reducers);
    store.subscribe((d)=>{
        const state = store.getState()
        localStorage.setItem(storeName, JSON.stringify(state))
    })
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
    );
})();