const numeral = require('numeral');

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
  let graphic = x.changePercent > 0 ? "▲" : "▼";
  return `${graphic} ${x.companyName} (${x.symbol}) | Price: ${mny3(x.latestPrice)} (${pct(x.changePercent)}) | Day: ${mny(x.low)} - ${mny(x.high)} | Year: ${mny(x.week52Low)} - ${mny(x.week52High)} | Market Cap: ${mny(x.marketCap)}`;
}

module.exports = {
  mny,
  mny3,
  pct,
  std,
  simpleStockSummary
};
