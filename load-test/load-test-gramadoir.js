const axios = require("axios");

n = parseInt(process.env.NUM_REQUESTS) || 500;
const abairUrl = "http://localhost:4000/gramadoir/callAnGramadoir/" + encodeURIComponent('mo madra'); // currently served version
const authToken = "";
//const abairUrl = "https://www.abair.ie/cgi-bin/api-gramadoir-1.0.pl";
//const abairUrl = "https://maddiecomtois-psychic-system-4jg569xq4jqc974-80.preview.app.github.dev/cgi-bin/gramadoir.pl";

main()

function request(text) {
	return  `teacs=${encodeURIComponent(text)}&teanga=en`
}

async function main() {
	let success = 0;
	let fail = 0;

	const config = {
		headers:{
		  'Authorization': 'Bearer ' + authToken,
		}
	  };

	await Promise.all(Array(n).fill(undefined).map(async ()=>{
		return axios.post(abairUrl, null, config)
			.then(r=>{success++; console.log(r.data)}, () => {fail++;});
	}));
	console.log("SUCCESS: ", success);
	console.log("FAIL:    " , fail);
}