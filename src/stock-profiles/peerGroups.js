const urlBuilder = require('../utility/urlBuilder');

const peers = (msg) => {
  if (urlBuilder.failIfMissingToken(msg)) {
    return;
  }

  const url = urlBuilder.stockProfiles.peerGroups(msg.match[2]);
  const sym = msg.match[2];
  msg.robot.logger.debug(`hubot-stock-checker: stockProfiles.peerGroups [${sym}] called`);

  msg.http(url).get()((err, res, body) => {
    if (res.statusCode === 402) {
      msg.send('This is not available for free tier accounts. Please upgrade your account to use this action.');
      return;
    }
    if (res.statusCode >= 400) {
      msg.send(`Failed to retrieve volume by venue for [${sym}].`);
      return;
    }

    const json = JSON.parse(body);
    msg.send(`Peers for [${sym}]: ${json.joined(', ')}`);
  });
};

module.exports = { peers };
