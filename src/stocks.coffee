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

numeral = require('numeral')

iexBaseUrl = "https://api.iextrading.com/1.0"

module.exports = (robot) ->

  robot.respond /(get )?stock (.*)/i, (msg) ->
    
    statsUrl = "#{iexBaseUrl}/stock/#{msg.match[2]}/quote"
    msg.http(statsUrl)
      .get() (err, res, body) ->
        statsBody = JSON.parse(body)
        
        graphic = if statsBody.changePercent > 0 then "▲" else "▼"
        name = statsBody.companyName
        symbol = statsBody.symbol
        price = numeral(statsBody.latestPrice).format('($0.00 a)')
        change = numeral(statsBody.changePercent).format('0.[0000]%')
        dayHigh = numeral(statsBody.high).format('($0.00 a)')
        dayLow = numeral(statsBody.low).format('($0.00 a)')
        yearHigh = numeral(statsBody.week52High).format('($0.00 a)')
        yearLow = numeral(statsBody.week52Low).format('($0.00 a)')
        marketCap = numeral(statsBody.marketCap).format('($0.00 a)')
        
        msg.send "#{graphic} #{name} (#{symbol}) | Price: #{price} (#{change}) | Day: #{dayLow} - #{dayHigh} | Year: #{yearLow} - #{yearHigh} | Market Cap: #{marketCap}"
