import React, { useState, useEffect } from 'react';
import {TonClient} from "@tonclient/core";
import {libWeb, libWebSetup} from "@tonclient/lib-web";
// libWebSetup({
//     binaryURL: "/tonclient_1.5.3.wasm",
// });


chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
chrome.browserAction.setBadgeText ( { text: "1" } );

chrome.runtime.onStartup.addListener(async () => {
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    chrome.browserAction.setBadgeText ( { text: "loading" } );
});