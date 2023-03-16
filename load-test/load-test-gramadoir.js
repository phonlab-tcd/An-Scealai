const axios = require("axios");

n = parseInt(process.env.NUM_REQUESTS) || 500;
const abairUrl = "http://localhost:4000/gramadoir/en/dia%20duit%20a%20cara"; // currently served version
//const abairUrl = "https://www.abair.ie/cgi-bin/api-gramadoir-1.0.pl";
//const abairUrl = "https://maddiecomtois-psychic-system-4jg569xq4jqc974-80.preview.app.github.dev/cgi-bin/gramadoir.pl";

main()

function request(text) {
	return  `teacs=${encodeURIComponent(text)}&teanga=en`
}

async function main() {
	let success = 0;
	let fail = 0;
	await Promise.all(Array(n).fill(undefined).map(async ()=>{
		return axios.get(abairUrl)
			.then(r=>{success++; console.log(r.data)}, () => {fail++;});
	}));
	console.log("SUCCESS: ", success);
	console.log("FAIL:    " , fail);
}