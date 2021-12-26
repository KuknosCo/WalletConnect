# Kuknos Extension 

## What is extension

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kuknos extension is a wallet on Kuknos Network build exclusively for internet browsers.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You can use this SDK to do and short some operation without sharing secret key to any third party applications.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You just have to install the SDK and use the appropriate functions. Users of your application have to install the Kuknos 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;browser extension on their browser for interaction with the SDK and your application.


## Installation
<b>Install Kuknos browser extension with below links:</b>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Firefox Kuknos Extension](https://addons.mozilla.org/en-GB/firefox/addon/kuknos-wallet/)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Chrome Kuknos Extension](https://chrome.google.com/webstore/detail/kuknos-wallet/piddfmmaocogbhnfgmgnkdliffakmjfp)


<br />
<br />
<br />
<br />


# Kuknos Extension SDK
## Installation
&nbsp;&nbsp;&nbsp;Using npm:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```npm i kuknos-wallet-connect```

&nbsp;&nbsp;&nbsp;Using yarn:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```yarn add kuknos-wallet-connect```

## Use
&nbsp;&nbsp;&nbsp;First import it like below:

``` javascript
import KuknosIntent from 'kuknos-wallet-connect';
```

## Intents

###  - Account Public key

#### &nbsp;&nbsp;&nbsp;Example

<div style="margin-left: 20px">

``` javascript
import KuknosIntent from 'kuknos-wallet-connect';

KuknosIntent.getAccountproject_id()
    .then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });

```
</div>

#### &nbsp;&nbsp;&nbsp;Return 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>public</td>
    <td>string</td>
    <td>Account id</td>
  </tr>
</table>


<br />
<hr />


###  - Account Balances

#### &nbsp;&nbsp;&nbsp;Example

<div style="margin-left: 20px">

``` javascript
import KuknosIntent from 'kuknos-wallet-connect';

KuknosIntent.getAccountBalances('GDWNW72K5RSW77JTCPADH5EYL2VT4FLUNN43CLIXKEGORT7YO5JDLHLK')
    .then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });

```
</div>

#### &nbsp;&nbsp;&nbsp;Params 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>public</td>
    <td>string</td>
    <td>Account id</td>
  </tr>
</table>


#### &nbsp;&nbsp;&nbsp;Return 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>public</td>
    <td>string</td>
    <td>The source account</td>
  </tr>
  <tr>
    <td>network</td>
    <td>Public | test</td>
    <td></td>
  </tr>
  <tr>
    <td>balances</td>
    <td>Array of Balance</td>
    <td> 
      <table>
        <tr>
          <th>Name</th>
          <th>Type</th>
        </tr>
        <tr>
          <td>asset_code</td>
          <td>string</td>
        </tr>
        <tr>
          <td>asset_issuer</td>
          <td>string</td>
        </tr>
        <tr>
          <td>available_balance</td>
          <td>number</td>
        </tr>
        <tr>
          <td>balance</td>
          <td>number</td>
        </tr>
        <tr>
          <td>buying_liabilites</td>
          <td>string</td>
        </tr>
        <tr>
          <td>selling_liabilites</td>
          <td>string</td>
        </tr>
        <tr>
          <td>limit</td>
          <td>string</td>
        </tr>
      </table>
    </td>
  </tr>
</table>



<br />
<hr />

###  - Create Account 

#### &nbsp;&nbsp;&nbsp;Example

<div style="margin-left: 20px">

``` javascript
import KuknosIntent from 'kuknos-wallet-connect';

KuknosIntent.createAccount('0913*****3333')
    .then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });

```
</div>

#### &nbsp;&nbsp;&nbsp;Params 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>identifire</td>
    <td>string</td>
    <td>Phone number or email address that sign with secret of generated keypair</td>
  </tr>
</table>


#### &nbsp;&nbsp;&nbsp;Return 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>public</td>
    <td>string</td>
    <td>The source account</td>
  </tr>
  <tr>
    <td>signature</td>
    <td>string</td>
    <td>Signature</td>
  </tr>
  
</table>


<br />
<hr />

###  - Change Trust

#### &nbsp;&nbsp;&nbsp;Example

<div style="margin-left: 20px">

``` javascript
import KuknosIntent from 'kuknos-wallet-connect';

KuknosIntent.changeTrust({
      type: 'add',
      asset_code : 'DAYADIAMOND',
      asset_issuer: 'GDWNW72K5RSW77JTCPADH5EYL2VT4FLUNN43CLIXKEGORT7YO5JDLHLK',
      limit: 5000
    })
    .then((result) => {
      console.log(result);

    }).catch((err) => {
      console.log(err);
      
    });


```
</div>

#### &nbsp;&nbsp;&nbsp;Params 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>data</td>
    <td>object</td>
    <td>
      <table>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
        <tr>
          <td>type</td>
          <td>Add | remove</td>
          <td></td>
        </tr>
        <tr>
          <td>asset_code</td>
          <td>string</td>
          <td>The asset code for the trust line.</td>
        </tr>
        <tr>
          <td>asset_issuer</td>
          <td>string</td>
          <td> *optional*  The asset issuer for the trust line</td>
        </tr>
        <tr>
          <td>limit</td>
          <td>number</td>
          <td>The limit for the asset, defaults to max int64. If the limit is set to "0" it deletes the trustline.</td>
        </tr>
      </table>
    </td>
  </tr>
</table>


#### &nbsp;&nbsp;&nbsp;Return 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>public</td>
    <td>string</td>
    <td>The source account</td>
  </tr>
  <tr>
    <td>status</td>
    <td>string</td>
    <td></td>
  </tr>
  
</table>

<br />
<hr />

###  - Curve Encryption


#### &nbsp;&nbsp;&nbsp;Example

<div style="margin-left: 20px">

``` javascript
import KuknosIntent from 'kuknos-wallet-connect';

 KuknosIntent.curveEncrypt({
      data: 'plain text',
      project_id: 'GDWNW72K5RSW77JTCPADH5EYL2VT4FLUNN43CLIXKEGORT7YO5JDLHLK'
    })
    .then((result) => {
      console.log(result);
      
    }).catch((err) => {
      console.log(err);
      
    });
```
</div>

#### &nbsp;&nbsp;&nbsp;Params 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>data</td>
    <td>object</td>
    <td>
      <table>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
        <tr>
          <td>data</td>
          <td>string</td>
          <td>plain Text data</td>
        </tr>
        <tr>
          <td>public</td>
          <td>string</td>
          <td>Public key that you want to encrypted data with it</td>
        </tr>
      </table>
    </td>
  </tr>
</table>


#### &nbsp;&nbsp;&nbsp;Return 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>ciphertext</td>
      <td>string</td>
      <td>Encrypted Data</td>
  </tr>
</table>

<br />
<hr />

###  - Curve Decryption

#### &nbsp;&nbsp;&nbsp;Example

<div style="margin-left: 20px">

``` javascript
import KuknosIntent from 'kuknos-wallet-connect';

 KuknosIntent.curveDecrypt('cipher text')
    .then((result) => {
      console.log(result);
      
    }).catch((err) => {
      console.log(err);
      
    });
```
</div>

#### &nbsp;&nbsp;&nbsp;Params 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>ciphertext</td>
    <td>string</td>
    <td>Encrypted Data</td>
  </tr>
</table>


#### &nbsp;&nbsp;&nbsp;Return 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>public</td>
    <td>string</td>
    <td>The source account</td>
  </tr>
  <tr>
    <td>data</td>
    <td>string</td>
    <td>plain Text data</td>
  </tr>
</table>

<br />
<hr />

###  - Sign Xdr

#### &nbsp;&nbsp;&nbsp;Example

<div style="margin-left: 20px">

``` javascript
import KuknosIntent from 'kuknos-wallet-connect';

 KuknosIntent.signXdr('xdr')
    .then((result) => {
      console.log(result);
      
    }).catch((err) => {
      console.log(err);
      
    });
```
</div>

#### &nbsp;&nbsp;&nbsp;Params 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>xdr</td>
    <td>string</td>
    <td>The transaction base64 encoded string</td>
  </tr>
</table>


#### &nbsp;&nbsp;&nbsp;Return 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>public</td>
    <td>string</td>
    <td>The source account</td>
  </tr>
  <tr>
    <td>xdr</td>
    <td>string</td>
    <td>Signed xdr</td>
  </tr>
  <tr>
    <td>network</td>
    <td>Public | test</td>
    <td></td>
  </tr>
</table>

<br />
<hr />

###  - Sign Data

#### &nbsp;&nbsp;&nbsp;Example

<div style="margin-left: 20px">

``` javascript
import KuknosIntent from 'kuknos-wallet-connect';

 KuknosIntent.signData('data')
    .then((result) => {
      console.log(result);
      
    }).catch((err) => {
      console.log(err);
      
    });
```
</div>

#### &nbsp;&nbsp;&nbsp;Params 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>data</td>
    <td>string</td>
    <td>Data to sign</td>
  </tr>
</table>


#### &nbsp;&nbsp;&nbsp;Return 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>public</td>
    <td>string</td>
    <td>The source account</td>
  </tr>
  <tr>
    <td>Signature</td>
    <td>string</td>
    <td>Signature</td>
  </tr>

</table>

<br />
<hr />

###  - recover Extension Account

#### &nbsp;&nbsp;&nbsp;Example

<div style="margin-left: 20px">

``` javascript
import KuknosIntent from 'kuknos-wallet-connect';

 KuknosIntent.recoverExtenstionAccount('0913****3333')
    .then((result) => {
      console.log(result);
      
    }).catch((err) => {
      console.log(err);
      
    });
```
</div>

#### &nbsp;&nbsp;&nbsp;Params 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>identifire</td>
    <td>string</td>
    <td>Phone number or email address that sign with secret of keypair</td>
  </tr>
</table>


#### &nbsp;&nbsp;&nbsp;Return 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>public</td>
    <td>string</td>
    <td>The source account</td>
  </tr>
  <tr>
    <td>Signature</td>
    <td>string</td>
    <td>Signature</td>
  </tr>

</table>


<br />
<hr />

###  - Payment


#### &nbsp;&nbsp;&nbsp;Example

<div style="margin-left: 20px">

``` javascript
import KuknosIntent from 'kuknos-wallet-connect';

KuknosIntent.payment({
      amount : 1.25,
      destination: 'GDWNW72K5RSW77JTCPADH5EYL2VT4FLUNN43CLIXKEGORT7YO5JDLHLK',
      asset_code : 'PMN',
      memo : 'test'
    })
    .then((result) => {
      console.log(result);
      
    }).catch((err) => {
      console.log(err);
      
    });
```
</div>

#### &nbsp;&nbsp;&nbsp;Params 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>data</td>
    <td>object</td>
    <td>
      <table>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
        <tr>
          <td>amount</td>
          <td>number</td>
          <td>The amount to send.</td>
        </tr>
        <tr>
          <td>destination</td>
          <td>string</td>
          <td>The destination account ID.</td>
        </tr>
        <tr>
          <td>memo</td>
          <td>string</td>
          <td>**optional**</td>
        </tr>
        <tr>
          <td>asset_code</td>
          <td>string</td>
          <td>The asset code to send.</td>
        </tr>
        <tr>
          <td>asset_issuer</td>
          <td>string</td>
          <td>**optional** The asset issuer code to send.</td>
        </tr>
      </table>
    </td>
  </tr>
</table>


#### &nbsp;&nbsp;&nbsp;Return 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>public</td>
    <td>string</td>
    <td>The source account</td>
  </tr>
  <tr>
    <td>network</td>
    <td>Public | test</td>
    <td></td>
  </tr>
  <tr>
    <td>status</td>
    <td>string</td>
    <td>Status of operation</td>
  </tr>
  <tr>
    <td>transaction_hash</td>
    <td>string</td>
    <td></td>
  </tr>

</table>

<br />
<hr />

###  - Set Network


#### &nbsp;&nbsp;&nbsp;Example

<div style="margin-left: 20px">

``` javascript
import KuknosIntent from 'kuknos-wallet-connect';

KuknosIntent.setNetwork('public')
```
</div>

#### &nbsp;&nbsp;&nbsp;Params 

<table style="margin-left: 20px">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>net</td>
    <td>Public | test</td>
    <td>Network that you want work with it </td>
  </tr>
</table>


#### &nbsp;&nbsp;&nbsp;Return 

<div style="margin-left: 20px">
  void
</div>

</table>

<br >
<ht />

