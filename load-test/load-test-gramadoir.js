const axios = require("axios");

n = parseInt(process.env.NUM_REQUESTS) || 50;
const abairUrl = "https://phoneticsrv3.lcs.tcd.ie/gramadoir/api-gramadoir-1.0.pl"; // currently served version
//const abairUrl = "https://www.abair.ie/cgi-bin/api-gramadoir-1.0.pl";
//const abairUrl = "https://maddiecomtois-psychic-system-4jg569xq4jqc974-80.preview.app.github.dev/cgi-bin/gramadoir.pl";
function request(text) {
	return  `teacs=${encodeURIComponent(text)}&teanga=en`
}

Array(n).fill(undefined).forEach(async (_x,i)=>{
	const headers = {
		"Content-Type": "application/x-www-form-urlencoded",
	};

	let success = 0;
	let fail = 0;

	await axios.post(abairUrl, request("dia dhuit a cara"), {headers})
		.then(r=>{success++; console.log(r.data)}, () => {fail++;});

		console.log("SUCCESS: ", success);
		console.log("FAIL:    " , fail);
});
