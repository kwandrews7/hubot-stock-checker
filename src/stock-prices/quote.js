const urlBuilder = require('../utility/urlBuilder');
const { simpleStockSummary } = require('../utility/formatters');

const quote = (msg) => {
  if (urlBuilder.failIfMissingToken(msg)) {
    return;
  }

  msg.robot.logger.debug(`hubot-stock-checker: stockPrices.quote [${msg.match[2]}] called`);
  const statsUrl = urlBuilder.quote(msg.match[2]);
  msg.http(statsUrl).get()((err, res, body) => {
    if (res.statusCode >= 400) {
      msg.send(`Stock [${msg.match[2]}] was not found on IEX.`);
      return;
    }
    const statsBody = JSON.parse(body);
    msg.send(simpleStockSummary(statsBody));
  });
};

module.exports = { quote };
