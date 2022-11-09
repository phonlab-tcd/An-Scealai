const axios = require("axios");

n = process.env.NUM_REQUESTS || 50;
const abairUrl = "https://www.abair.ie/cgi-bin/api-gramadoir-1.0.pl";
function request(text) {
	return  `teacs=${encodeURIComponent(text)}&teanga=en`
}

Array(n).fill(undefined).forEach(async (_x,i)=>{
	const headers = {
		"Content-Type": "application/x-www-form-urlencoded",
	};

	await axios.post(abairUrl, request("dia dhuit a cara"), {headers})
		.then(console.log,console.log);
});
