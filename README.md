Get quick stats on any stock by asking your hubot!

[![NPM](https://nodei.co/npm/hubot-stock-checker.png?downloads=true&&downloadRank=true&stars=true)](https://nodei.co/npm/hubot-stock-checker/)

This integration utilizes hubot to interact with stock stats provided for free by [IEX Trading](https://iextrading.com/developer). Some friends and I wanted to be able to quickly ask our bot in slack for stock updates and realized that the several existing hubot-scripts were old and broken, many relying on the deprecated Yahoo! Finance APIs. Many thanks to IEX Trading for providing a reliable, free, and easy to use API. It made this entire process way to easy. Hats off to you.

If you have a use case that you would like implemented reach out to me via twitter (@kwandrews7) or get your hands dirty and create a pull request. I'd like to keep this package focused on the IEX API just for consistency, but the APIs available are quite extensive and can do much more than I have currently integrated. Check out their API docs linked above to see what all is available. As I have time, and as they are useful to me :), I will continue integrating with more of their available endpoints.

Example Interaction:

> User >> hubot stock f
> 
> Hubot >> ▼ Ford Motor Company (F) | Price: $10.05  (-0.298%%) | Day: $10.04  - $10.10  | Year: $9.82  - $13.48  | Market Cap: $40.06 b

API
---

* `hubot get stock (symbol)` - Returns basic stock stats. 'get' is optional. Name, symbol, price, daily price change, day, month, and year price range, and market cap.
* `hubot get stock (symbol) dividends` - Returns dividend history for the past year. 'dividends' can be replaced with div, divs, or dividends to achieve the same response. 'get' is still optional. Dividends as reported by IEX Trading for the past year. This API is currently missing the the two latest dividends on occasion, an active issue is open on GitHub.
* `hubot get stock (symbol) info` - Returns company information. Name, symbol, description, CEO, website, industry, and IEX trading tags.
* `hubot get stock (symbol) stats` - Returns key stats: Name, symbol, market cap, float, change (5d, 1m, 1y, 5y), dividends (yld / rate), latest EPS, EBITDA, revenue, gross profits, cash and debt.
* `hubot get stock top losers` - Returns stocks with the most downward movement. (max 5).
* `hubot get stock top movers` - Returns stocks with the most movement, absolute value. (max 5).
* `hubot get stock top winners` - Returns stocks with the most upward movement. (max 5).

## Installation

Run the following command 

    $ npm install hubot-stock-checker --save

To enable the script, add a `hubot-stock-checker` entry to the `external-scripts.json`
file (you may need to create this file).

    ["hubot-stock-checker"]

## Release Notes

### 1.3.1

* It has been brought to my attention that moving the price field from `latestPrice` to `iexRealtimePrice` was a bad idea. Apparently, the real time price drops to zero after hours for certain stocks. I put it back to latestPrice, my bad. 

### 1.3.0

* Added new command for key stats from IEX. 

### 1.2.1

* Same code, republished after correction in git repo.

### 1.2.0

* Current stock price gives tenth of cent accuracy.
* Added new commands for company info and dividends. 

### 1.1.2

* Fixing double percentage printout... sorry. Don't program at 5am in an airport.

### 1.1.1

* Changed slack emoji trends to generic unicode for users using other chat platforms
* Updated percentage formatting using numeral

### 1.1.0

* Added market cap
* Added trending graphic for slack
* Added currency formatting using numeral

### 1.0.3

* And yet another typo pointed out by a friend and fixed, don't program late at night guys. It's bad news. Change percentage should now be a number all the time instead of sometimes.

### 1.0.2

* Fixed missing tags around interpolated string value. The actual symbol for the company will now get shown instead of the word 'symbol'.


### 1.0.1

* Corrected typo in URL and parser.

### 1.0.0

* Integrated with open IEX API to retrieve basic stock stats.
