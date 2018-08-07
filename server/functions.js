function round(num) {
	return (Math.round(100*num)/100).toFixed(2);
}

module.exports = {

	// PARAMETERS
	//   input: an array of data points to calculate upon
	//   size: the number of data points to create each moving average
	//
	// RETURNS
	//   an array of moving averages of the size of the input minus the 
	//   number of data points

	sma: (input, size) => {
		var result = Array.from({ length: input.length - size }, () => 0);
		var count = 0;
		for (var i = 0; i < size; i++) result[0] += input[i];
		for (var i = 1; i < result.length; i++) result[i] = result[i-1] - input[i-1] + input[i-1+size];
		for (var i = 0; i < result.length; i++) result[i] = round(result[i] / size);
		return result;
	},
}