const numeral = require("numeral");

function mny(x) {
  return numeral(x).format("($0.00 a)");
}

function mny3(x) {
  return numeral(x).format("($0.000 a)");
}

function pct(x) {
  return numeral(x).format("0.[0000]%");
}

function std(x) {
  return numeral(x).format("(0.00 a)");
}

function simpleStockSummary(x) {
  let extendedHours = "";
  if (x.extendedPriceTime > x.closeTime) {
    let priceTime = new Date(x.extendedPriceTime);
    let extGraphic = x.extendedChangePercent > 0 ? "▲" : "▼";
    extendedHours = `\n_${extGraphic} After Hours | Price: ${mny3(x.extendedPrice)} (${pct(x.extendedChangePercent)}) | Time: ${priceTime.toLocaleTimeString("en-US", { timeZone: "America/New_York"})} (ET)_`;
  }
  let graphic = x.changePercent > 0 ? "▲" : "▼";
  return `${graphic} ${x.companyName} (${x.symbol}) | Price: ${mny3(x.latestPrice)} (${pct(x.changePercent)}) | Day: ${mny(x.low)} - ${mny(x.high)} | Year: ${mny(x.week52Low)} - ${mny(x.week52High)} | Market Cap: ${mny(x.marketCap)}${extendedHours}`;
}

function holdingsSummary(stock, shares) {
  let graphic = stock.changePercent > 0 ? "▲" : "▼";
  let price = (stock.extendedPriceTime > stock.closeTime) ? stock.extendedPrice : stock.latestPrice;
  let value = shares * price;
  return `${graphic} | ${stock.symbol} | ${stock.companyName} | Price: ${mny3(stock.latestPrice)} (${pct(stock.changePercent)}) | Shares: ${shares} | Value: ${mny(value)}`;
}

module.exports = {
  mny,
  mny3,
  pct,
  std,
  simpleStockSummary,
  holdingsSummary
};
