const TRADE_INTERVAL = 180 * 1000;
const SMA_TO_CALC = [50,100,200,400];
const DRY = true;

const f = require('./functions.js');

// "rh" is Robinhood API, "av" is Alpha Vantage
module.exports = (api,rh_token,callback) => {
	if (DRY) rh_token = undefined;

	var rh = api.robinhood;
	var av = api.alphavantage;

	console.log("Initializing automated trading...\n");
	console.log("> Trading interval set to " + TRADE_INTERVAL + "ms");

	function processData() {
		av.crypto_intra("BTC", (err,res,body) => {
			var json = JSON.parse(body)["Time Series (Digital Currency Intraday)"];
			if (json) {
				var array_of_nums = Array.from({ length: Object.keys(json).length }, () => 0);
				var result = Array.from({ length: SMA_TO_CALC.length }, () => 0);
				var i = 0;
				for (var date in json) {
					array_of_nums[i] = Number.parseFloat(json[date]["1a. price (USD)"]);
					i++;
				}

				for (var i=0; i<SMA_TO_CALC.length; i++) {
					result[i] = f.sma(array_of_nums, SMA_TO_CALC[i]);
					console.log(">   SMA " + SMA_TO_CALC[i] + ": " + result[i][result.length-1]);
				}
				callback(array_of_nums, result);
			}
			else console.log("> ERROR: JSON was null");
			api.get("https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD", (err, res, body) => {
				console.log("> Current Price: " + JSON.parse(res.body).BTC.USD);
			});
		});
	};

	processData();
	setInterval(processData, TRADE_INTERVAL);
}