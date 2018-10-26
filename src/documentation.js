// Description:
//   Hubot script to return stock information the IEX API.
//
// Dependencies:
//   "numeral": "^2.0.6"
//
// Configuration:
//   None
//
// Commands:
//   hubot get stock (symbol) - Returns basic stock stats. 'get' is optional.
//   hubot get stock (symbol) dividends - Returns dividend history for the past year. 'get' is optional.
//   hubot get stock (symbol) info - Returns company information. 'get' is optional.
//   hubot get stock (symbol) stats - Returns key stats. 'get' is optional.
//   hubot get stock (symbol) news - Returns related news articles as replies in a thread.
//   hubot save stock (symbol) - Saves the symbol to the current channel's watchlist.
//   hubot delete stock (symbol) - Deletes the symbol from the current channel's watchlist.
//   hubot list my/our favorites - Lists basic stock stats for each of the saved symbols.
//   hubot get stock top losers - Returns stocks with the most downward movement. (max 5). 'get' is optional.
//   hubot get stock top movers - Returns stocks with the most movement, absolute value. (max 5). 'get' is optional.
//   hubot get stock top winners - Returns stocks with the most upward movement. (max 5). 'get' is optional.
//   hubot save (number) shares of (symbol) - Saves the stock symbol and shares count to the current channel's holdings.
//   hubot delete shares of (symbol) - Deletes the stock symbol and shares count from the current channel's holdings.
//   hubot list my/our holdings - Lists all stock holdings for the current channel showing price and value (price * shares).
// 
// Author: 
//   kwandrews7
//

module.exports = (robot) => {
  // Empty implementation. File exists to maintain jarvis help commands while 
  // keeping documentation from cluttering implementation files.
};