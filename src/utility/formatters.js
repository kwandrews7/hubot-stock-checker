const numeral = require('numeral');

const mny = (x) => numeral(x).format('($0.00 a)');
const mny3 = (x) => numeral(x).format('($0.000 a)');
const pct = (x) => numeral(x).format('0.[0000]%');
const std = (x) => numeral(x).format('(0.00 a)');

const simpleStockSummary = (x) => {
  console.log(x);
  let extendedHours = '';
  // Only give extended prices if they are newer and different.
  if ((x.extendedPriceTime > x.closeTime) && (x.extendedPriceTime > x.latestUpdate) && (x.latestPrice != x.extendedPrice)) {
    const priceTime = new Date(x.extendedPriceTime);
    const extGraphic = x.extendedChangePercent > 0 ? '▲' : '▼';
    extendedHours = `\n_${extGraphic} After Hours | Price: ${mny3(x.extendedPrice)} (${pct(x.extendedChangePercent)}) | Time: ${priceTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York' })} (ET)_`;
  }
  const graphic = x.changePercent > 0 ? '▲' : '▼';
  const summary = `${graphic} ${x.companyName} (${x.symbol}) | Price: ${mny3(x.latestPrice)} (${pct(x.changePercent)}) | Day: ${mny(x.low)} - ${mny(x.high)} | Year: ${mny(x.week52Low)} - ${mny(x.week52High)} | Market Cap: ${mny(x.marketCap)}${extendedHours}`;
  console.log(summary);
  return summary;
};

const holdingsSummary = (stock, shares) => {
  const graphic = stock.changePercent > 0 ? '▲' : '▼';
  const price = (stock.extendedPriceTime > stock.closeTime) ? stock.extendedPrice : stock.latestPrice;
  const value = shares * price;
  return `${graphic} | ${stock.symbol} | ${stock.companyName} | Price: ${mny3(stock.latestPrice)} (${pct(stock.changePercent)}) | Shares: ${shares} | Value: ${mny(value)}`;
};

module.exports = {
  mny,
  mny3,
  pct,
  std,
  simpleStockSummary,
  holdingsSummary,
};
