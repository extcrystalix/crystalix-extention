# Сrystalix wallet for TON tokens

This repository contains source code for web-extension that allow interaction with Free Ton blockchain from your browser.

# Browser supporting

* Chrome [pending publications]
* Safary [in developing]
* Firefox [in developing]

# Preview

<img src="docs/crystallix-preview.png" title="Сrystalix TON wallet"/>

# How build/run this extension

## Build sources

```
git clone https://github.com/extcrystalix/crystalix-extention.git
cd crystalix-extention
npm install

#npm run start #if you want to run in browser

npm run build
```

After compilation, open chrome browser, and typing ```chrome://extensions/```

Set developer mode on this page:

<img src="docs/developmode.png" title="developmode"/>

Press to unpacked extension:
<img src="docs/load.png" title="load unpacked extenstion"/>

And choose folder crystalix-extention/build