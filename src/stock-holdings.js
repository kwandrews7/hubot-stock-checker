const numeral = require('numeral');
const iexBaseUrl = 'https://api.iextrading.com/1.0';
const {
  holdingsSummary
} = require('./formatters');

module.exports = function (robot) {

  if (!robot.brain.data.stock_checker_holdings) {
    robot.brain.data.stock_checker_holdings = {};
  }

  robot.respond(/save (\d+) shares of (\w*\.?\w*)$/i, function (msg) {
    let numShares = parseFloat(msg.match[1]);
    let symbol = msg.match[2].toUpperCase();
    let channel = msg.message._channel_id;
    console.log(`hubot-stock-checker: save shares of stock called from channel [${channel}]`);

    let holdings = robot.brain.data.stock_checker_holdings[channel] || {};
    holdings[symbol] = numShares;
    robot.brain.data.stock_checker_holdings[channel] = holdings;
    msg.send(`I've saved [${numShares}] of [${symbol}] to this channel's holdings.`);
  });

  robot.respond(/delete shares of (\w*\.?\w*)$/i, function (msg) {
    let numShares = parseFloat(msg.match[1]);
    let symbol = msg.match[1].toUpperCase();
    let channel = msg.message._channel_id;
    console.log(`hubot-stock-checker: delete shares of stock called from channel [${channel}]`);

    let holdings = robot.brain.data.stock_checker_holdings[channel] || {};
    delete holdings[symbol];
    robot.brain.data.stock_checker_holdings[channel] = holdings;
    msg.send(`I've removed all shares of [${symbol}] from this channel's holdings.`);
  });

  robot.respond(/(list )?(my |our )?holdings( )?$/i, function (msg) {
    let numShares = msg.match[1];
    let symbol = msg.match[2].toUpperCase();
    let channel = msg.message._channel_id;
    console.log(`hubot-stock-checker: list holdings called from channel [${channel}]`);

    let holdings = robot.brain.data.stock_checker_holdings[channel] || {};
    let keys = Object.keys(holdings);


    if (keys.length > 0) {
      for (var i = 0; i < keys.length; i++) {
        let symbol = keys[i];
        let numShares = holdings[symbol];
        getHoldings(msg, symbol, numShares);
      }
    } else {
      msg.send(`Sorry, I don't appear to have any holdings saved here. Maybe you wanted to add some instead?`);
    }
  });

};

function getHoldings(msg, symbol, numShares) {
  let stockUrl = `${iexBaseUrl}/stock/${symbol}/quote`;
  msg.http(stockUrl).get()(function (err, res, body) {
    if (res.statusCode >= 400) {
      msg.send(`Sorry, I couldn't find [${symbol}] on IEX.`);
      return;
    }
    let statsBody = JSON.parse(body);
    msg.send(holdingsSummary(statsBody, numShares));
  });
}
