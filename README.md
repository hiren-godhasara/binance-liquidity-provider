# Binance Liquidity Provider

## Installation Process

### 1. Clone or Download Repository
```html
    https://github.com/hiren-godhasara/binance-liquidity-provider.git
```
### 2. Install the dependencies and devDependencies
```html
    npm i
```
### 3. Go to the  .ENV file and set Binance testnet user APIKEY and SECERET 
##### Path :  binance-liquidity-provider/.env
(example)
```html
APIKEY='XXXXXXXXXXX-YOUR-APIKEY-XXXXXXXXXXXXXXXX'
APISECRET='XXXXXXXXXXX-YOUR-SECERET-XXXXXXXXXXXXXXXX'
```
### 4. Run Project/Start Project  
```html
    node index.js
```
## To start provide liquidity 
to start provide liquidity we want to call below api with required body parameters.  
#### Method 
```html
     POST 
```
#### Endpoint url 
```html
    /api/v1/liquidity-provide
```
#### Body 
##### Body must be object with below mandatory parameters.
###### *if not sending mandetory parameters system consider default value. 
##### Parameters

| Name | Type | Mandatory | Description |  Default |
| ------ | ------ |------|-----|-----|
| symbol | String | YES | You can set any symbol pair which is binance listed | BTCUSDT
| askDifference | Number | YES  |  Ask order diffrence from live price| 10 
| bidDifference | Number | YES |  Bid order diffrence from live price| 10 
| askAmount | Number | YES |  Ask order Amount | 0.001
| bidAmount | Number | YES |  Bid  order Amount | 0.001
