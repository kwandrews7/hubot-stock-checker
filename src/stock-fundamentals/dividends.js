const urlBuilder = require('../utility/urlBuilder');
const { mny } = require('../utility/formatters');

const dividends = (msg) => {
  if (urlBuilder.failIfMissingToken(msg)) {
    return;
  }

  msg.robot.logger.debug(`hubot-stock-checker: stockFundamentals.dividends [${msg.match[2]}] called`);
  const divsUrl = urlBuilder.dividends(msg.match[2]);
  msg.http(divsUrl).get()((err, res, body) => {
    if (res.statusCode >= 400) {
      msg.send(`Stock [${msg.match[2]}] was not found on IEX.`);
      return;
    }
    const divsBody = JSON.parse(body);
    const divsMsg = divsBody.map((div) => `${mny(div.amount)} | ${div.exDate} | ${div.paymentDate}   | ${div.recordDate}  | ${div.declaredDate}`);
    divsMsg.unshift('```\nAmount | Ex Date    | Payment Date | Record Date | Declared Date');
    divsMsg.push('```');
    msg.send(divsMsg.join('\n'));
  });
};

module.exports = { dividends };
