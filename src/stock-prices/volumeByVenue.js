const urlBuilder = require('../utility/urlBuilder.js');
const { pct, std } = require('../utility/formatters');

const volumeMessageFromJson = (v) => {
  const totalVolume = std(v.volume);
  const marketPct = pct(v.marketPercent);
  const avgMarketPct = pct(v.avgMarketPercent);
  return `${v.venueName}, [15m] ${marketPct}, ${totalVolume} shares. [30d avg] ${avgMarketPct}`;
};

const volumeByVenue = (msg) => {
  const sym = msg.match[1];
  msg.robot.logger.debug(`hubot-stock-checker: stockPrices.volumeByVenue [${sym}] called`);
  const url = urlBuilder.stockPrices.volumeByVenue(sym);
  msg.http(url).get()((err, res, body) => {
    if (res.statusCode === 402) {
      msg.send('Volume by venue is not available for free tier accounts. Please upgrade your account to use this action.');
      return;
    }
    if (res.statusCode >= 400) {
      msg.send(`Failed to retrieve volume by venue for [${sym}].`);
      return;
    }

    const json = JSON.parse(body);
    const volumes = json.map((x) => volumeMessageFromJson(x));
    msg.send(`${sym} Volume by Venue\n${volumes.joined('\n')}`);
  });
};

module.exports = { volumeByVenue };
