const {
  simpleStockSummary,
} = require('./utility/formatters');
const urlBuilder = require('./utility/urlBuilder.js');

module.exports = function (robot) {
  if (!robot.brain.data.stock_checker_favs) {
    robot.brain.data.stock_checker_favs = {};
  }

  robot.respond(/save stock (\w*\.?\w*)$/i, (msg) => {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    const symbol = msg.match[1].toUpperCase();
    const channel = msg.message.room;
    robot.logger.debug(`hubot-stock-checker: save stock [${symbol}] called from channel [${channel}]`);

    if (Array.isArray(robot.brain.data.stock_checker_favs[channel]) && robot.brain.data.stock_checker_favs[channel].includes(symbol)) {
      msg.send(`It looks like I've already saved that stock to this room's favorites. Here's the list of favorites for this room: [${robot.brain.data.stock_checker_favs[channel].join(', ')}]`);
    } else {
      if (!robot.brain.data.stock_checker_favs[channel]) {
        robot.brain.data.stock_checker_favs[channel] = [];
      }
      robot.brain.data.stock_checker_favs[channel].push(symbol);
      msg.send(`No problem. Here's the updated list of favorites for this room: [${robot.brain.data.stock_checker_favs[channel].join(', ')}]`);
    }
  });

  robot.respond(/delete stock (\w*\.?\w*)$/i, (msg) => {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    const symbol = msg.match[1].toUpperCase();
    const channel = msg.message.room;
    robot.logger.debug(`hubot-stock-checker: delete stock [${symbol}] called from channel [${channel}]`);

    if (Array.isArray(robot.brain.data.stock_checker_favs[channel]) && robot.brain.data.stock_checker_favs[channel].includes(symbol)) {
      robot.brain.data.stock_checker_favs[channel] = robot.brain.data.stock_checker_favs[channel]
        .filter((_symbol) => _symbol.toUpperCase() !== symbol.toUpperCase());
      msg.send(`No problem. Here's the updated list of favorites for this room: [${robot.brain.data.stock_checker_favs[channel].join(', ')}]`);
    } else {
      msg.send(`I don't have that stock saved in here. Here's the updated list of favorites for this room: [${robot.brain.data.stock_checker_favs[channel].join(', ')}]`);
    }
  });

  robot.respond(/(list )?(my |our )?favorites?( stocks)?$/i, (msg) => {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    const symbol = msg.match[1].toUpperCase();
    const channel = msg.message.room;
    robot.logger.debug(`hubot-stock-checker: list favorite stocks called from channel [${channel}]`);

    if (Array.isArray(robot.brain.data.stock_checker_favs[channel]) && robot.brain.data.stock_checker_favs[channel].length > 0) {
      robot.brain.data.stock_checker_favs[channel].forEach((fav) => {
        const stockUrl = urlBuilder.quote(fav);
        msg.http(stockUrl).get()((err, res, body) => {
          if (res.statusCode >= 400) {
            msg.send(`Sorry, I couldn't find [${fav}] on IEX. Maybe remove that from your favorites?`);
            return;
          }
          const statsBody = JSON.parse(body);
          msg.send(simpleStockSummary(statsBody));
        });
      });
    } else {
      msg.send('Sorry, I don\'t appear to have any stocks saved here. Maybe you wanted to add some stocks instead?');
    }
  });
};
