const numeral = require('numeral');
const iexBaseUrl = 'https://cloud.iexapis.com/v1';
const {
  mny,
  mny3,
  pct,
  std,
  simpleStockSummary
} = require('./formatters');
const urlBuilder = require('./urlBuilder');

module.exports = function (robot) {

  robot.respond(/(get )?stock (\w*\.?\w*)$/i, function (msg) {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    robot.logger.debug(`hubot-stock-checker: getStock [${msg.match[2]}] called`);
    let statsUrl = urlBuilder.quote(msg.match[2]);
    msg.http(statsUrl).get()(function (err, res, body) {
      if (res.statusCode >= 400) {
        msg.send(`Stock [${msg.match[2]}] was not found on IEX.`);
        return;
      }
      let statsBody = JSON.parse(body);
      msg.send(simpleStockSummary(statsBody));
    });
  });

  robot.respond(/(get )?stock (\w*\.?\w*) (div|dividend|divs|dividends)$/i, function (msg) {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    robot.logger.debug(`hubot-stock-checker: getStockDividends [${msg.match[2]}] called`);
    let divsUrl = urlBuilder.dividends(msg.match[2]);
    msg.http(divsUrl).get()(function (err, res, body) {
      if (res.statusCode >= 400) {
        msg.send(`Stock [${msg.match[2]}] was not found on IEX.`);
        return;
      }
      let divsBody = JSON.parse(body);
      let divsMsg = divsBody.map(div => `${mny(div.amount)} | ${div.exDate} | ${div.paymentDate}   | ${div.recordDate}  | ${div.declaredDate}`);
      divsMsg.unshift('```\nAmount | Ex Date    | Payment Date | Record Date | Declared Date');
      divsMsg.push('```');
      msg.send(divsMsg.join('\n'));
    });
  });

  robot.respond(/(get )?stock (\w*\.?\w*) (info)$/i, function (msg) {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    robot.logger.debug(`hubot-stock-checker: getStockInfo [${msg.match[2]}] called`);
    const infoUrl = urlBuilder.company(msg.match[2]);
    msg.http(infoUrl).get()(function (err, res, body) {
      if (res.statusCode >= 400) {
        msg.send(`Stock [${msg.match[2]}] was not found on IEX.`);
        return;
      }
      let info = JSON.parse(body);
      let msgRes = [];
      msgRes.push(`${info.companyName} (${info.symbol})`);
      msgRes.push(info.description);
      msgRes.push(`CEO: ${info.CEO}, Exchange: ${info.exchange}`);
      msgRes.push(`Industry: ${info.industry}, Sector: ${info.sector}`);
      let tags = info.tags.join(", ");
      msgRes.push(`IEX Trading Tags: ${tags}`);
      msgRes.push(info.website);
      msg.send(msgRes.join("\n"));
    });
  });

  robot.respond(/(get )?stock (\w*\.?\w*) (stats|stat|statistics)$/i, function (msg) {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    robot.logger.debug(`hubot-stock-checker: getStockStats [${msg.match[2]}] called`);
    let statsUrl = urlBuilder.stats(msg.match[2]);
    msg.http(statsUrl).get()(function (err, res, body) {
      if (res.statusCode >= 400) {
        msg.send(`Stock [${msg.match[2]}] was not found on IEX.`);
        return;
      }
      let stats = JSON.parse(body);
      let msgRes = [];
      msgRes.push(`${stats.companyName} (${stats.symbol}), Mrkt Cap: ${mny(stats.marketcap)}, Float: ${std(stats.float)}`);
      msgRes.push(`Change: (5d) ${pct(stats.day5ChangePercent)}, (1m) ${pct(stats.month1ChangePercent)}, (1y) ${pct(stats.year1ChangePercent)}, (5y) ${pct(stats.year5ChangePercent)}`);
      msgRes.push(`Dividends: (Yield) ${std(stats.dividendYield)}, (Rate) ${mny(stats.dividendRate)}. EPS: ${mny(stats.latestEPS)} (${stats.latestEPSDate})`);
      msgRes.push(`EBITDA: ${mny(stats.EBITDA)}, Revenue: ${mny(stats.revenue)}, Gross Profit: ${mny(stats.grossProfit)}`);
      msgRes.push(`Cash: ${mny(stats.cash)}, Debt: ${mny(stats.debt)}`);
      msg.send(msgRes.join('\n'));
    });
  });

  robot.respond(/(get )?stock (\w*\.?\w*) (news|stories)$/i, function (msg) {
    if (urlBuilder.failIfMissingToken(msg)) {
      return;
    }

    robot.logger.debug(`hubot-stock-checker: getNews [${msg.match[2]}] called`);
    const newsUrl = urlBuilder.news(msg.match[2]);
    msg.http(newsUrl).get()(function (err, res, body) {
      if (res.statusCode >= 400) {
        msg.send(`Stock [${msg.match[2]}] was not found on IEX.`);
        return;
      }
      msg.message.thread_ts = msg.message.rawMessage.ts;
      let news = JSON.parse(body);
      news.map(article => msg.send(article.url));
    });
  });

};
