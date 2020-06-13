const urlBuilder = require('../utility/urlBuilder.js');

const statusFromCode = (code) => {
  switch (code) {
    case 'H':
      return 'Trading halted across all US equity markets';
    case 'O':
      return 'Trading halt released into an Order Acceptance Period (IEX-listed securities only)';
    case 'P':
      return 'Trading paused and Order Acceptance Period on IEX (IEX-listed securities only)';
    default:
      return null;
  }
};

const reasonFromCode = (code) => {
  switch (code) {
    case 'T1':
      return 'Halt News Pending';
    case 'IPO1':
      return 'IPO/New Issue Not Yet Trading';
    case 'IPOD':
      return 'IPO/New Issue Deferred';
    case 'MCB3':
      return 'Market-Wide Circuit Breaker Level 3 – Breached';
    case 'NA':
      return 'Reason Not Available';
    case 'T2':
      return 'Halt News Dissemination';
    case 'IPO2':
      return 'IPO/New Issue Order Acceptance Period';
    case 'IPO3':
      return 'IPO Pre-Launch Period';
    case 'MCB1':
      return 'Market-Wide Circuit Breaker Level 1 – Breached';
    case 'MCB2':
      return 'Market-Wide Circuit Breaker Level 2 – Breached';
    default:
      return null;
  }
};

const tradingStatus = (msg) => {
  const sym = msg.match[1].toUpperCase();
  msg.robot.logger.debug(`hubot-stock-checker: deep.tradingStatus [${sym}] called`);
  const url = urlBuilder.deep.tradingStatus(sym);
  msg.http(url).get()((err, res, body) => {
    if (res.statusCode >= 400) {
      msg.send(`Failed to verify trading status for [${sym}].`);
      return;
    }

    const json = JSON.parse(body);
    const status = statusFromCode(json[sym].status);
    const reason = reasonFromCode(json[sym].reason);

    if (status) {
      msg.send(`${sym} - ${status} [${reason}]`);
    } else {
      msg.send(`${sym} is actively trading on IEX.`);
    }
  });
};

module.exports = { tradingStatus };
