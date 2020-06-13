const { company } = require('./stock-profiles/company');

const { quote } = require('./stock-prices/quote');
const { volumeByVenue } = require('./stock-prices/volumeByVenue');

const { tradingStatus } = require('./deep/tradingStatus');

// eslint-disable-next-line func-names
module.exports = function (robot) {
  robot.respond(/trading status (\w*\.?\w*)$/i, tradingStatus);
  robot.respond(/volume by venue (\w*\.?\w*)$/i, volumeByVenue);
  robot.respond(/(get )?stock (\w*\.?\w*) (company|info)$/i, company);
  robot.respond(/(get )?stock (\w*\.?\w*)$/i, quote);
};
