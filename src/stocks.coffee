# Description:
#   Hubot script to return stock information the IEX API.
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   hubot get stock (stock symbol) - Returns basic stock stats.

iexBaseUrl = "https://api.iextrading.com/1.0"

module.exports = (robot) ->

  robot.respond /(get )?stock (.*)/i, (msg) ->
    
    statsUrl = "#{iexBaseUrl}/stock/#{msg.match[2]}/quote"
    msg.http(statsUrl)
      .get() (err, res, body) ->
        statsBody = JSON.parse(body)
        
        name = statsBody.companyName
        symbol = statsBody.symbol
        price = statsBody.latestPrice
        change = statsBody.changePercent * 100
        dayHigh = statsBody.high
        dayLow = statsBody.low
        yearHigh = statsBody.week52High
        yearLow = statsBody.week52Low
        
        msg.send "#{name} (#{symbol}) | Price: #{price} (#{change}%) | Day: #{dayLow} - #{dayHigh} | Year: #{yearLow} - #{yearHigh}"
