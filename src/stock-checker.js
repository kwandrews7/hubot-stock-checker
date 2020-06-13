const { company } = require('./stock-profiles/company');
const { peers } = require('./stock-profiles/peerGroups');

const { quote } = require('./stock-prices/quote');
const { volumeByVenue } = require('./stock-prices/volumeByVenue');

const { dividends } = require('./stock-fundamentals/dividends');

const { tradingStatus } = require('./deep/tradingStatus');

// eslint-disable-next-line func-names
module.exports = function (robot) {
  robot.respond(/(get )?stock (\w*\.?\w*) (company|info)$/i, company);
  robot.respond(/(get )?stock (\w*\.?\w*) (peers|peer groups)$/i, peers);

  robot.respond(/(get )?stock (\w*\.?\w*)$/i, quote);
  robot.respond(/volume by venue (\w*\.?\w*)$/i, volumeByVenue);

  robot.respond(/(get )?stock (\w*\.?\w*) (div|dividend|divs|dividends)$/i, dividends);

  robot.respond(/trading status (\w*\.?\w*)$/i, tradingStatus);
};
