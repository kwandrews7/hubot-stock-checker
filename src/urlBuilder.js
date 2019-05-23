const iexBaseUrl = 'https://cloud.iexapis.com/v1';
const token = process.env.HUBOT_IEX_CLOUD_TOKEN || 'NO_TOKEN_PROVIDED';

function failIfMissingToken(msg) {
  if (token === 'NO_TOKEN_PROVIDED') {
    msg.send('`HUBOT_IEX_CLOUD_TOKEN` env variable is missing. Please configure and try again.');
    return true
  }
  return false
}

function company(sym) {
  return `${iexBaseUrl}/stock/${sym}/company?token=${token}`
}

function dividends(sym) {
  return `${iexBaseUrl}/stock/${sym}/dividends/1y?token=${token}`
}

function marketLosers() {
  return `${iexBaseUrl}/stock/market/list/losers?token=${token}`
}

function marketMovers() {
  return `${iexBaseUrl}/stock/market/list/mostactive?token=${token}`
}

function marketWinners() {
  return `${iexBaseUrl}/stock/market/list/gainers?token=${token}`
}

function news(sym) {
  return `${iexBaseUrl}/stock/${sym}/news?token=${token}`
}

function stats(sym) {
  return `${iexBaseUrl}/stock/${sym}/stats?token=${token}`
}

function quote(sym) {
  return `${iexBaseUrl}/stock/${sym}/quote?token=${token}`;
}

module.exports = {
  company,
  dividends,
  failIfMissingToken,
  marketLosers,
  marketMovers,
  marketWinners,
  news,
  stats,
  quote
};
