import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/Popup/App'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import storeCreatorFactory from 'reduxed-chrome-storage';
import reducers from './reducers';


(async () => {
    const storeName = "sn"
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


    // const store = await storeCreatorFactory({createStore})(reducers);
    // //const store = createStore(reducers)
    // ReactDOM.render(
    //     <Provider store={store}>
    //         <App />
    //     </Provider>,
    //     document.getElementById('root')
    // );
// const store = storeCreatorFactory({createStore})(reducers);
// ReactDOM.render(
//     <Provider store={store}>
//         <App />
//     </Provider>,
//     document.getElementById('root')
// );