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

numeral = require("numeral")

iexBaseUrl = "https://api.iextrading.com/1.0"

money = (m) -> numeral(m).format("($0.00 a)")

module.exports = (robot) ->

  robot.respond /(get )?stock (\w*\.?\w*)$/i, (msg) ->
    statsUrl = "#{iexBaseUrl}/stock/#{msg.match[2]}/quote"
    msg.http(statsUrl)
      .get() (err, res, body) ->
        statsBody = JSON.parse(body)
        graphic = if statsBody.changePercent > 0 then "▲" else "▼"
        name = statsBody.companyName
        symbol = statsBody.symbol
        price = numeral(statsBody.latestPrice).format("($0.000 a)")
        change = numeral(statsBody.changePercent).format("0.[0000]%")
        dayHigh = money(statsBody.high)
        dayLow = money(statsBody.low)
        yearHigh = money(statsBody.week52High)
        yearLow = money(statsBody.week52Low)
        marketCap = money(statsBody.marketCap)
        msg.send "#{graphic} #{name} (#{symbol}) | Price: #{price} (#{change}) | Day: #{dayLow} - #{dayHigh} | Year: #{yearLow} - #{yearHigh} | Market Cap: #{marketCap}"


  robot.respond /(get )?stock (\w*\.?\w*) (div|dividend|divs|dividends)$/i, (msg) -> 
    divsUrl = "#{iexBaseUrl}/stock/#{msg.match[2]}/dividends/1y"
    msg.http(divsUrl)
      .get() (err, res, body) ->
        divsBody = JSON.parse(body)
        divsMsg = divsBody.map (div) -> 
          "#{money(div.amount)} | #{div.exDate} | #{div.paymentDate}   | #{div.recordDate}  | #{div.declaredDate}"
        divsMsg.unshift("```\nAmount | Ex Date    | Payment Date | Record Date | Declared Date")
        divsMsg.push("```")
        msg.send divsMsg.join("\n")


  robot.respond /(get )?stock (\w*\.?\w*) (info)$/i, (msg) -> 
    infoUrl = "#{iexBaseUrl}/stock/#{msg.match[2]}/company"
    msg.http(infoUrl)
      .get() (err, res, body) -> 
        info = JSON.parse(body)
        msgRes = []
        msgRes.push("#{info.companyName} (#{info.symbol})")
        msgRes.push(info.description)
        msgRes.push("CEO: #{info.CEO}, Exchange: #{info.exchange}")
        msgRes.push("Industry: #{info.industry}, Sector: #{info.sector}")
        tags = info.tags.join(", ")
        msgRes.push("IEX Trading Tags: #{tags}")
        msgRes.push(info.website)
        msg.send msgRes.join("\n")