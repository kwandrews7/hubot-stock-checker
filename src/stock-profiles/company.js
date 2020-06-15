const urlBuilder = require('../utility/urlBuilder');

const company = (msg) => {
  if (urlBuilder.failIfMissingToken(msg)) {
    return;
  }

  msg.robot.logger.debug(`hubot-stock-checker: stockProfiles.company [${msg.match[2]}] called`);
  const infoUrl = urlBuilder.stockProfiles.company(msg.match[2]);
  msg.http(infoUrl).get()((err, res, body) => {
    if (res.statusCode >= 400) {
      msg.send(`Stock [${msg.match[2]}] was not found on IEX.`);
      return;
    }

    const info = JSON.parse(body);
    const streetAddr = (info.street2 != null)
      ? `${info.street1}, ${info.street2}` : `${info.street1}`;
    const msgRes = [
      `${info.companyName} [${info.symbol}], Exchange: ${info.exchange}`,
      `${streetAddr}`,
      `${info.city}, ${info.state} ${info.zip} ${info.country}`,
      info.phone,
      `Industry: ${info.industry}, Sector: ${info.sector}`,
      `CEO: ${info.CEO}, Total Employees: ${info.employees}`,
      `Website: ${info.website}`,
      info.description,
      `IEX Trading Tags: ${info.tags.join(', ')}`,
    ];
    msg.send(msgRes.join('\n'));
  });
};

module.exports = { company };
