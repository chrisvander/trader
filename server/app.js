const request = require("request");
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require('path');
const bodyParser = require('body-parser');
const api = require('./api.js');
const robinhood = api.robinhood;
const trader = require('./trader.js');

var app = express();

// TEMPLATING

app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'pug'); 

// GLOBAL MIDDLEWARE

app.use(express.static(path.join(__dirname, '../client/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// SPECIFIC MIDDLEWARE

function verifyAuth(req,res,next) {
	if (req.cookies.token !== "" && req.cookies.token) {
		// We have token, start the automated trader
		trader.init(api, req.cookies.token);
		next();
	}
	else res.redirect('/login');
}

// PAGES

app.get("/", verifyAuth, (req,res) => robinhood.user(req.cookies.token, (err, apiRes, body) => {
	if (err) res.status(403).send(err);
	else {
		res.cookie("account_id", JSON.parse(body).id);
		res.render('index', {
			user: JSON.parse(body)
		});
	}
}));

app.get("/login", (req,res) => res.render('login'));

// API

app.post("/login", (req,res) => 
robinhood.login(req.body.user, req.body.pass, (err, apiRes, body) => {
	console.log(body)
	if (err) res.status(403).send(err);
	try {
		if (!JSON.parse(body).access_token) 
			res.status(401).render('login',{
				error: JSON.parse(body).non_field_errors
			});
		else {
			robinhood.get(JSON.parse(body).token, "https://api.robinhood.com/accounts/", (errAc, apiResAc, bodyAc) => {
				console.log(bodyAc)
				res.cookie("token",JSON.parse(body).access_token);
				res.cookie("refresh_token",JSON.parse(body).refresh_token);
				res.redirect("/");
			});
		}
	}
	catch (err) {
		res.status(500).render('login',{
			error: 'Internal Server Error: Failed to parse request'
		});
	}
}));

app.get("/logout", (req,res) => robinhood.logout(req.cookies.token, (err, apiRes, body) => {
  res.cookie("token","");
  res.cookie("account_id","");
	if (err) res.status(403).send(err);
	else res.redirect("/");
}));

app.get("/positions", (req,res) => {
	robinhood.position(req.cookies.token, req.cookies.userID, (err, apiRes, body) => {
		if (err) res.status(403).send(err);
		else res.send(body);
	});
});

app.get("/accounts", (req,res) => {
	robinhood.get(req.cookies.token, "https://api.robinhood.com/accounts/", (err, apiRes, body) => {
		if (err) res.status(403).send(err);
		else res.send(body);
	});
});

app.get("/instrument", (req,res) => {
	robinhood.get(req.cookies.token, req.query.url, (err, apiRes, body) => {
		if (err) res.status(403).send(err);
		else res.send(body);
	});
});

// SERVER

app.listen(8080, () => {
	console.log("Listening on port 8080");
});

