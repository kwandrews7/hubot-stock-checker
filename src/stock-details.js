const {
  mny,
  pct,
  std,
} = require('./utility/formatters');
const urlBuilder = require('./utility/urlBuilder');

module.exports = function (robot) {
  robot.respond(/(get )?stock (\w*\.?\w*) (div|dividend|divs|dividends)$/i, (msg) => {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    robot.logger.debug(`hubot-stock-checker: getStockDividends [${msg.match[2]}] called`);
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
  });

  robot.respond(/(get )?stock (\w*\.?\w*) (stats|stat|statistics)$/i, (msg) => {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    robot.logger.debug(`hubot-stock-checker: getStockStats [${msg.match[2]}] called`);
    const statsUrl = urlBuilder.stats(msg.match[2]);
    msg.http(statsUrl).get()((err, res, body) => {
      if (res.statusCode >= 400) {
        msg.send(`Stock [${msg.match[2]}] was not found on IEX.`);
        return;
      }
      const stats = JSON.parse(body);
      const msgRes = [];
      msgRes.push(`${stats.companyName} (${stats.symbol}), Mrkt Cap: ${mny(stats.marketcap)}, Float: ${std(stats.float)}`);
      msgRes.push(`Change: (5d) ${pct(stats.day5ChangePercent)}, (1m) ${pct(stats.month1ChangePercent)}, (1y) ${pct(stats.year1ChangePercent)}, (5y) ${pct(stats.year5ChangePercent)}`);
      msgRes.push(`Dividends: (Yield) ${std(stats.dividendYield)}, (Rate) ${mny(stats.dividendRate)}. EPS: ${mny(stats.latestEPS)} (${stats.latestEPSDate})`);
      msgRes.push(`EBITDA: ${mny(stats.EBITDA)}, Revenue: ${mny(stats.revenue)}, Gross Profit: ${mny(stats.grossProfit)}`);
      msgRes.push(`Cash: ${mny(stats.cash)}, Debt: ${mny(stats.debt)}`);
      msg.send(msgRes.join('\n'));
    });
  });

  robot.respond(/(get )?stock (\w*\.?\w*) (news|stories)$/i, (msg) => {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    robot.logger.debug(`hubot-stock-checker: getNews [${msg.match[2]}] called`);
    const newsUrl = urlBuilder.news(msg.match[2]);
    msg.http(newsUrl).get()((err, res, body) => {
      if (res.statusCode >= 400) {
        msg.send(`Stock [${msg.match[2]}] was not found on IEX.`);
        return;
      }
      msg.message.thread_ts = msg.message.rawMessage.ts;
      const news = JSON.parse(body);
      news.map((article) => msg.send(article.url));
    });
  });
};
