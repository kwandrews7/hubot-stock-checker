const numeral = require('numeral');
const iexBaseUrl = 'https://api.iextrading.com/1.0';
const {
  simpleStockSummary
} = require('./formatters');

module.exports = function (robot) {

  robot.respond(/(get )?stock top losers$/i, function (msg) {
    robot.logger.debug(`hubot-stock-checker: getTopLosers called`);
    let losersUrl = `${iexBaseUrl}/stock/market/list/losers`;
    msg.http(losersUrl).get()(function (err, res, body) {
      let losers = JSON.parse(body).slice(0, 5).map(x => simpleStockSummary(x)).join('\n');
      msg.send(losers);
    });
  });

  robot.respond(/(get )?stock top winners$/i, function (msg) {
    robot.logger.debug(`hubot-stock-checker: getTopWinners called`);
    let gainersUrl = `${iexBaseUrl}/stock/market/list/gainers`;
    msg.http(gainersUrl).get()(function (err, res, body) {
      const winners = JSON.parse(body).slice(0, 5).map(x => simpleStockSummary(x)).join('\n');
      msg.send(winners);
    });
  });

  robot.respond(/(get )?stock top movers$/i, function (msg) {
    robot.logger.debug(`hubot-stock-checker: getTopMovers called`);
    let moversUrl = `${iexBaseUrl}/stock/market/list/mostactive`;
    msg.http(moversUrl).get()(function (err, res, body) {
      let movers = JSON.parse(body).slice(0, 5).map(x => simpleStockSummary(x)).join('\n');
      msg.send(movers);
    });
  });

};
