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

mny = (x) -> numeral(x).format("($0.00 a)")
mny3 = (x) -> numeral(x).format("($0.000 a)")
pct = (x) -> numeral(x).format("0.[0000]%")
std = (x) -> numeral(x).format("(0.00 a)")

simpleStockSummary = (x) -> 
  graphic = if x.changePercent > 0 then "▲" else "▼"
  name = x.companyName
  symbol = x.symbol
  price = mny3(x.iexRealtimePrice)
  change = pct(x.changePercent)
  dayHigh = mny(x.high)
  dayLow = mny(x.low)
  yearHigh = mny(x.week52High)
  yearLow = mny(x.week52Low)
  marketCap = mny(x.marketCap)
  "#{graphic} #{name} (#{symbol}) | Price: #{price} (#{change}) | Day: #{dayLow} - #{dayHigh} | Year: #{yearLow} - #{yearHigh} | Market Cap: #{marketCap}"

module.exports = (robot) ->

  robot.respond /(get )?stock (\w*\.?\w*)$/i, (msg) ->
    console.log("hubot-stock-checker: getStock called")
    statsUrl = "#{iexBaseUrl}/stock/#{msg.match[2]}/quote"
    msg.http(statsUrl)
      .get() (err, res, body) ->
        statsBody = JSON.parse(body)
        msg.send simpleStockSummary(statsBody)


  robot.respond /(get )?stock (\w*\.?\w*) (div|dividend|divs|dividends)$/i, (msg) -> 
    console.log("hubot-stock-checker: getStockDividends called")
    divsUrl = "#{iexBaseUrl}/stock/#{msg.match[2]}/dividends/1y"
    msg.http(divsUrl)
      .get() (err, res, body) ->
        divsBody = JSON.parse(body)
        divsMsg = divsBody.map (div) -> 
          "#{mny(div.amount)} | #{div.exDate} | #{div.paymentDate}   | #{div.recordDate}  | #{div.declaredDate}"
        divsMsg.unshift("```\nAmount | Ex Date    | Payment Date | Record Date | Declared Date")
        divsMsg.push("```")
        msg.send divsMsg.join("\n")


  robot.respond /(get )?stock (\w*\.?\w*) (info)$/i, (msg) ->
    console.log("hubot-stock-checker: getStockInfo called")
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
        
        
  robot.respond /(get )?stock (\w*\.?\w*) (stats|stat|statistics)$/i, (msg) ->
    console.log("hubot-stock-checker: getStockStats called")
    statsUrl = "#{iexBaseUrl}/stock/#{msg.match[2]}/stats"
    msg.http(statsUrl)
      .get() (err, res, body) -> 
        stats = JSON.parse(body)
        msgRes = []
        msgRes.push("#{stats.companyName} (#{stats.symbol}), Mrkt Cap: #{mny(stats.marketcap)}, Float: #{std(stats.float)}")
        msgRes.push("Change: (5d) #{pct(stats.day5ChangePercent)}, (1m) #{pct(stats.month1ChangePercent)}, (1y) #{pct(stats.year1ChangePercent)}, (5y) #{pct(stats.year5ChangePercent)}")
#        msgRes.push("52 Week Range: #{mny3(stats.week52low)} - #{mny3(stats.week52high)}, (Change) #{pct(stats.week52change / 100)}")
        msgRes.push("Dividends: (Yield) #{std(stats.dividendYield)}, (Rate) #{mny(stats.dividendRate)}. EPS: #{mny(stats.latestEPS)} (#{stats.latestEPSDate})")
        msgRes.push("EBITDA: #{mny(stats.EBITDA)}, Revenue: #{mny(stats.revenue)}, Gross Profit: #{mny(stats.grossProfit)}")
        msgRes.push("Cash: #{mny(stats.cash)}, Debt: #{mny(stats.debt)}")
        msg.send msgRes.join("\n")


  robot.respond /(get )?stock top losers$/i, (msg) ->
    console.log("hubot-stock-checker: getTopLosers called")
    losersUrl = "#{iexBaseUrl}/stock/market/list/losers"
    msg.http(losersUrl)
      .get() (err, res, body) -> 
        losers = JSON.parse(body)[..4].map (x) -> simpleStockSummary(x)
        msg.send losers.join("\n")
        
  
  robot.respond /(get )?stock top winners$/i, (msg) ->
    console.log("hubot-stock-checker: getTopWinners called")
    gainersUrl = "#{iexBaseUrl}/stock/market/list/gainers"
    msg.http(gainersUrl)
      .get() (err, res, body) -> 
        winners = JSON.parse(body)[..4].map (x) -> simpleStockSummary(x)
        msg.send winners.join("\n")
        
        
  robot.respond /(get )?stock top movers$/i, (msg) ->
    console.log("hubot-stock-checker: getTopMovers called")
    moversUrl = "#{iexBaseUrl}/stock/market/list/mostactive"
    msg.http(moversUrl)
      .get() (err, res, body) -> 
        movers = JSON.parse(body)[..4].map (x) -> simpleStockSummary(x)
        msg.send movers.join("\n")
        
  