import React, { useState, useEffect } from 'react';
import {TonClient} from "@tonclient/core";
import {libWeb, libWebSetup} from "@tonclient/lib-web";
// libWebSetup({
//     binaryURL: "/tonclient_1.5.3.wasm",
// });

function App() {
    TonClient.useBinaryLibrary(libWeb);
    useEffect(() => {
    alert(1)
    });
}
