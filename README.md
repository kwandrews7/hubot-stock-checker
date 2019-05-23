Get quick stats on any stock by asking your hubot!

[![NPM](https://nodei.co/npm/hubot-stock-checker.png?downloads=true&&downloadRank=true&stars=true)](https://nodei.co/npm/hubot-stock-checker/)

This integration utilizes hubot to interact with stock stats provided by [IEX Cloud](https://iexcloud.io/). I wanted quick access via my bot to stock values and found many existing hubot options were broken. So, I chose to write my own interacting with the free IEX Trading API. As of v2, IEX has moved away from the original IEX Trading api's to a new IEX Cloud api. You will need an IEX Cloud token (api key) to utilize this hubot plugin. Please note that these tokens are free, but paid tiers based on usage do exists. 

Since the start of this script, I've added a handful of features to fulfill the needs of me and my friends. However, if you have a feature you want, catch me on twitter (@kwandrews7) or create a pull request. [API docs are linked are available here.](https://iexcloud.io/docs/api/) 

Example Interaction:

> User >> hubot stock f
> 
> Hubot >> ▼ Ford Motor Company (F) | Price: $10.05  (-0.298%%) | Day: $10.04  - $10.10  | Year: $9.82  - $13.48  | Market Cap: $40.06 b

API
---

### Data on Individual Stocks

* `hubot get stock (symbol)` - Returns basic stock stats. 'get' is optional. Name, symbol, price, daily price change, day, month, and year price range, and market cap.
* `hubot get stock (symbol) dividends` - Returns dividend history for the past year. 'dividends' can be replaced with div, divs, or dividends to achieve the same response. 'get' is still optional. Dividends as reported by IEX Trading for the past year. This API is currently missing the the two latest dividends on occasion, an active issue is open on GitHub.
* `hubot get stock (symbol) info` - Returns company information. Name, symbol, description, CEO, website, industry, and IEX trading tags.
* `hubot get stock (symbol) stats` - Returns key stats: Name, symbol, market cap, float, change (5d, 1m, 1y, 5y), dividends (yld / rate), latest EPS, EBITDA, revenue, gross profits, cash and debt.
* `hubot get stock (symbol) news` - Returns related news articles as replies in a thread.

### Saved Watchlists

* Watchlists are saved by channel. This means each channel and direct message will have it's own watchlist.
* `hubot save stock (symbol)` - Saves the symbol to the current channel's watchlist.
* `hubot delete stock (symbol)` - Deletes the symbol from the current channel's watchlist.
* `hubot list (our/my) favorites` - Lists basic stock stats for each of the saved symbols.

### IEX Collections 

* `hubot get stock top losers` - Returns stocks with the most downward movement. (max 5).
* `hubot get stock top movers` - Returns stocks with the most movement, absolute value. (max 5).
* `hubot get stock top winners` - Returns stocks with the most upward movement. (max 5).

### Saved Holdings

* `hubot save (number) shares of (symbol)` - Saves the symbol and shares count to the current channel's holdings.
* `hubot delete shares of (symbol)` - Deletes the symbol and shares count from the current channel's holdings.
* `hubot save (number) shares of (symbol)` - Lists all holdings for the current channel showing price and value (price * shares).


## Installation

Run the following command 

    $ npm install hubot-stock-checker --save

To enable the script, add a `hubot-stock-checker` entry to the `external-scripts.json`
file (you may need to create this file).

    ["hubot-stock-checker"]
    
Once installed, you will need to configure your IEX Cloud public token as environment variable `HUBOT_IEX_CLOUD_TOKEN`. 

## Release Notes

### 2.0.0

* All calls updated to use the new IEX Cloud apis.
* Script now requires configuration of IEX Cloud api token environment variable.
* Readme updated with latest links and information related to IEX Cloud.
* All urls moved into urlBuilder.js to consolidate the use of the token param.

### 1.6.4

* Problem found with non-slack adapters. I was dumbly using the _channel_id field on the message in some places instead of the room field. Other places used the room field correctly, now everything uses the room field. Saving shares and favorites should now work across all adapters. Sorry for the bug.

### 1.6.3

* Deleting saved holdings was broken using an incorrect regex match. This is now fixed.

### 1.6.2

* After hours fix. It should only display now if all of the following conditions are met: extendedPriceTime is after closeTime, extendedPrice and latest price do not match, and extendedPriceTime is after latestUpdate.

### 1.6.1

* Added stock symbol and share count to `list my holdings` command.
* Updated `list my holdings` command to allow for an optional trailing space to prevent missed commands typed using mobile keyboards that auto space words.

### 1.6.0

* Added after hours price and movements when applicable. 
* Added saved holdings to each channel. Allows users to notate current holdings and get valuation in one simple command.
* Holdings and favorites are managed separately. 
* Each channel, group, or direct message maintains it's own holdings list and favorites list.

### 1.5.0

* Added new watchlist to each channel using save, delete, and list favorites commands.
* Watchlist are saved to the hubot brain, if you aren't persisting the brain to redis, you'll lose watchlists on restarts.
* Added message for failed requests.
* Converted project from coffeescript to javascript.
* Refactored project into smaller, easier to manage files.

### 1.4.0

* Added new command to retrieve relevant news articles from IEX.
* Updated logging statements.

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
