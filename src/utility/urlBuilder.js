const iexBaseUrl = 'https://cloud.iexapis.com/v1';
// const iexBaseUrl = 'https://sandbox.iexapis.com/v1';
const token = process.env.HUBOT_IEX_CLOUD_TOKEN || 'NO_TOKEN_PROVIDED';

const failIfMissingToken = (msg) => {
  if (token === 'NO_TOKEN_PROVIDED') {
    msg.send('`HUBOT_IEX_CLOUD_TOKEN` env variable is missing. Please configure and try again.');
    return true;
  }
  return false;
};

const company = (sym) => `${iexBaseUrl}/stock/${sym}/company?token=${token}`;
const dividends = (sym) => `${iexBaseUrl}/stock/${sym}/dividends/1y?token=${token}`;
const marketLosers = () => `${iexBaseUrl}/stock/market/list/losers?token=${token}`;
const marketMovers = () => `${iexBaseUrl}/stock/market/list/mostactive?token=${token}`;
const marketWinners = () => `${iexBaseUrl}/stock/market/list/gainers?token=${token}`;
const news = (sym) => `${iexBaseUrl}/stock/${sym}/news?token=${token}`;
const stats = (sym) => `${iexBaseUrl}/stock/${sym}/stats?token=${token}`;
const quote = (sym) => `${iexBaseUrl}/stock/${sym}/quote?token=${token}`;
const volumeByVenue = (sym) => `${iexBaseUrl}/stock/${sym}/volume-by-venue?token=${token}`;
const tradingStatus = (sym) => `${iexBaseUrl}/deep/trading-status?symbols=${sym}&token=${token}`;
const peerGroups = (sym) => `${iexBaseUrl}/stock/${sym}/peers?token=${token}`;

module.exports = {
  dividends,
  failIfMissingToken,
  marketLosers,
  marketMovers,
  marketWinners,
  news,
  stats,
  quote,
  stockPrices: {
    volumeByVenue,
  },
  stockProfiles: {
    company,
    peerGroups,
  },
  deep: {
    tradingStatus,
  },
};
