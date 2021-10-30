const request = require("request");
const locals = require("../locals.json");

module.exports = {

	// GENERAL
	get: (url, next) => request(url, (err, res, body) => next(err, res, body)),

	// ROBINHOOD
	robinhood: {
		login: (user, pass, next) => {
			request({
			  uri: "https://api.robinhood.com/oauth2/token/",
			  method: "POST",
			  form: {
			    username: user,
			    password: pass,
			    grant_type: 'password',
			    scope: 'internal',
			    client_id: 'c82SH0WZOsabOXGP2sxqcj34FxkvfnWRZBKlBjFS',
			    device_token: locals.device_token,
			  }
			}, (err, res, body) => next(err, res, body));
		},

		logout: (token, next) => {
			request({
			  uri: "https://api.robinhood.com/api-token-logout/",
			  method: "POST",
			  headers: {
			    "Authorization": "Token " + token
			  }
			}, (err, res, body) => next(err, res, body));
		},

		user: (token, next) => {
			request({
			  uri: "https://api.robinhood.com/user/",
			  method: "GET",
			  headers: {
			    "Authorization": "Token " + token
			  }
			}, (err, res, body) => next(err, res, body));
		},

		position: (token, id, next) => {
			request({
				uri: "https://api.robinhood.com/accounts/"+id+"/positions",
				method: "GET",
				headers: {
			    "Authorization": "Token " + token
			  }
			}, (err, res, body) => next(err, res, body));
		},

		get: (token, url, next) => {
			request({
				uri: url,
				method: "GET",
				headers: {
			    "Authorization": "Token " + token
			  }
			}, (err, res, body) => next(err, res, body));
		},
	},

	// ALPHA VANTAGE

	alphavantage: {
		crypto_intra: (symbol, next) => {
			request({
				uri: "https://www.alphavantage.co/query",
				method: "GET",
			  qs: {
			  	"function": "DIGITAL_CURRENCY_INTRADAY",
			  	"symbol": (symbol) ? symbol : "BTC",
			  	"market": "USD",
			  	"apikey": locals.alpha_vantage
			  }
			}, (err, res, body) => next(err, res, body));
		}
	}
}