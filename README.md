Get quick stats on any stock by asking your hubot!

[![NPM](https://nodei.co/npm/hubot-stock-checker.png?downloads=true&&downloadRank=true&stars=true)](https://nodei.co/npm/hubot-stock-checker/) [![NPM](https://nodei.co/npm-dl/hubot-stock-checker.png?months=3&height=3)](https://nodei.co/npm/hubot-stock-checker/)

This integration utilizes hubot to interact with stock stats provided for free by [IEX](https://iextrading.com/developer). I wanted to be able to quickly ask my bot for stock updates and realized after a quick search that several existing hubot-scripts were old and broken, most relying on the Yahoo! Finance APIs that have long since been shutdown. Many thanks to IEX for providing a reliable, free, and easy to use API. It made this entire process way to easy. Hats off to you folks.

If you have a use case that you would like implemented feel free to do the work yourself and create a pull request or reach out to me via the issues or twitter (@kwandrews7). I'd like to keep this package focused on the IEX API just for consistency, but the APIs available are quite extensive and can do much more than this initial build. Check out their API docs linked above to see what all is available.

API
---

* `hubot get stock (stock symbol)` - Returns basic stock stats.

## Installation

Run the following command 

    $ npm install hubot-stock-checker --save

To enable the script, add a `hubot-stock-checker` entry to the `external-scripts.json`
file (you may need to create this file).

    ["hubot-stock-checker"]

## Release Notes

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
