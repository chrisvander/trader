function roundToTwo(num) {
	return (Math.round(100*num)/100).toFixed(2);
}

const portfolio = new Vue({
	el: "#portfolio",
	data: {
		loading: true,
		portfolio: [],
		cryptos: [
			{
				"ticker": "BTC",
				"price": ""
			}
		],
		options: []
	},
	mounted() {
		
		// ALL STOCK POSITIONS

		axios.get("/positions").then(res => {
			this.portfolio = res.data.results;
			updatePositions(this);
			setInterval(() => updatePositions(this),10000);
		});

		function updatePositions(app) {
			var c_org=0;
			app.portfolio.forEach(item => {if (item.quantity!=0) ++c_org});

			var count=0;
			app.portfolio.forEach((item,i) => {
				if (item.quantity!=0) {
					axios.get("/instrument", {
					  params: { url: item.instrument }
					}).then(res => {
						axios.get("/instrument", {
						  params: { url: res.data.quote }
						}).then(res2 => {
							var type = 1;
							if (res2.data.previous_close < res2.data.ask_price) type = 2;
							var percent = roundToTwo(100*(res2.data.ask_price - res2.data.previous_close)/res2.data.previous_close);
							var append = "";
							if (percent > 0) append="+"
							Vue.set(item, "percent_change", append + percent + "%")
							Vue.set(item, "ticker", res.data.symbol);
							Vue.set(item, "movement", type);
							Vue.set(item, "price", "$" + roundToTwo(res2.data.bid_price));
							++count;
							if (count==c_org) app.loading = false;
						})
					});
				}
			});
			
			axios.get("https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD").then(res => {
				app.cryptos[0].price = "$" + roundToTwo(res.data.BTC.USD);
			});
		}

	}
});

const trader = new Vue({
	el: "#trader",
	data: {
		button_text: "Start",
		button_class: ""
	},
	methods: {
		startTrader: () => {
			if (this.button_text === "Start") {
				this.button_class = "disabled";
				this.button_text = "Starting...";
			}
		},
	},
});