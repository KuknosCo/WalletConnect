# Kuknos Extension SDK

Kuknos extension is a wallet on Kuknos Network build exclusively for internet browsers.

You can use this SDK to do and short some operation without sharing secret key to any third party applications.

You just have to install the SDK and use the appropriate functions. Users of your application have to install the Kuknos browser extension on their browser for interaction with the SDK and your application.

<b>Install Kuknos browser extension with below links:</b>

[Firefox Kuknos Extension](https://addons.mozilla.org/en-GB/firefox/addon/kuknos-wallet/)

[Chrome Kuknos Extension](https://chrome.google.com/webstore/detail/kuknos-wallet/piddfmmaocogbhnfgmgnkdliffakmjfp)


# Installation
Using npm:

```npm i kuknos-wallet-connect```

Using yarn:

```yarn add kuknos-wallet-connect```

# Use
First import it like below:

```
import KuknosIntent from 'kuknos-wallet-connect';
```

You can set the network: [default is ``public``]
```
KuknosIntent.setNetwork('public');
```

example method for ``payment``:

```
KuknosIntent.payment({
     amount: 0.0001,
     destination:'GARTVC5KJUEBPXSNDKFXBPK7U5QZJCBEJMWQ66HE7AHFSDYWB6TG5N6C',
     asset_code: 'PMN',
     memo: 'memo text'
   })
   .then((result) => {
     console.log(result);
    
   }).catch((err) => {
     console.log(err);
   });
```

# Document
You can find all methods in [Docs](https://kuknosco.github.io/kuknos-wallet-connect/)
