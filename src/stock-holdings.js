const {
  holdingsSummary,
} = require('./utility/formatters');
const urlBuilder = require('./utility/urlBuilder.js');

module.exports = function (robot) {
  if (!robot.brain.data.stock_checker_holdings) {
    robot.brain.data.stock_checker_holdings = {};
  }

  robot.respond(/save (\d+) shares of (\w*\.?\w*)$/i, (msg) => {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    const numShares = parseFloat(msg.match[1]);
    const symbol = msg.match[2].toUpperCase();
    const channel = msg.message.room;
    robot.logger.debug(`hubot-stock-checker: save shares of stock called from channel [${channel}]`);

    const holdings = robot.brain.data.stock_checker_holdings[channel] || {};
    holdings[symbol] = numShares;
    robot.brain.data.stock_checker_holdings[channel] = holdings;
    msg.send(`I've saved [${numShares}] of [${symbol}] to this channel's holdings.`);
  });

  robot.respond(/delete shares of (\w*\.?\w*)$/i, (msg) => {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    const numShares = parseFloat(msg.match[1]);
    const symbol = msg.match[1].toUpperCase();
    const channel = msg.message.room;
    robot.logger.debug(`hubot-stock-checker: delete shares of stock called from channel [${channel}]`);

    const holdings = robot.brain.data.stock_checker_holdings[channel] || {};
    delete holdings[symbol];
    robot.brain.data.stock_checker_holdings[channel] = holdings;
    msg.send(`I've removed all shares of [${symbol}] from this channel's holdings.`);
  });

  robot.respond(/(list )?(my |our )?holdings( )?$/i, (msg) => {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    const numShares = msg.match[1];
    const symbol = msg.match[2].toUpperCase();
    const channel = msg.message.room;
    robot.logger.debug(`hubot-stock-checker: list holdings called from channel [${channel}]`);

    const holdings = robot.brain.data.stock_checker_holdings[channel] || {};
    const keys = Object.keys(holdings);

    if (keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        const symbol = keys[i];
        const numShares = holdings[symbol];
        getHoldings(msg, symbol, numShares);
      }
    } else {
      msg.send('Sorry, I don\'t appear to have any holdings saved here. Maybe you wanted to add some instead?');
    }
  });
};

function getHoldings(msg, symbol, numShares) {
  const stockUrl = urlBuilder.quote(symbol);
  msg.http(stockUrl).get()((err, res, body) => {
    if (res.statusCode >= 400) {
      msg.send(`Sorry, I couldn't find [${symbol}] on IEX.`);
      return;
    }
    const statsBody = JSON.parse(body);
    msg.send(holdingsSummary(statsBody, numShares));
  });
}
