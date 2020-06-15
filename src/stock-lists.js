const {
  simpleStockSummary,
} = require('./utility/formatters');
const urlBuilder = require('./utility/urlBuilder.js');

module.exports = function (robot) {
  robot.respond(/(get )?stock top losers$/i, (msg) => {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    robot.logger.debug('hubot-stock-checker: getTopLosers called');
    const losersUrl = urlBuilder.marketLosers();
    msg.http(losersUrl).get()((err, res, body) => {
      const losers = JSON.parse(body).slice(0, 5).map((x) => simpleStockSummary(x)).join('\n');
      msg.send(losers);
    });
  });

  robot.respond(/(get )?stock top winners$/i, (msg) => {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    robot.logger.debug('hubot-stock-checker: getTopWinners called');
    const gainersUrl = urlBuilder.marketWinners();
    msg.http(gainersUrl).get()((err, res, body) => {
      const winners = JSON.parse(body).slice(0, 5).map((x) => simpleStockSummary(x)).join('\n');
      msg.send(winners);
    });
  });

  robot.respond(/(get )?stock top movers$/i, (msg) => {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    robot.logger.debug('hubot-stock-checker: getTopMovers called');
    const moversUrl = urlBuilder.marketMovers();
    msg.http(moversUrl).get()((err, res, body) => {
      const movers = JSON.parse(body).slice(0, 5).map((x) => simpleStockSummary(x)).join('\n');
      msg.send(movers);
    });
  });
};
