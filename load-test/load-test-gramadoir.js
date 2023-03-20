const axios = require("axios");

n = parseInt(process.env.NUM_REQUESTS) || 500;
const abairUrl = "http://localhost:4000/gramadoir/callAnGramadoir/" + encodeURIComponent('mo madra'); // currently served version
const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2ViYzc5NjYxNmRiZDU2M2RhMWM1NDYiLCJ1c2VybmFtZSI6IkRhbHRhMSIsInJvbGUiOiJTVFVERU5UIiwibGFuZ3VhZ2UiOiJnYSIsImV4cCI6MTY3OTQwNjczNC4xMzMsImlhdCI6MTY3ODgwMTkzNH0.ijThIGd4BZaMdmkLJGAFhaDXRcSWrUuaFd8azfrlbGK_i5tRDhuJnrKvzXxQK3a8NZLwwfCLaHSjkcsOTX1Exl75IOWfOEoKmfUkg-XFN2v6YdUMSVyNv2x_LAR8iHHOZUFqK-JWf3gadL94rqB8g2NzRxCeP6c5VmoKZOYdZDdTQAVj4KxrDQw3K9oqE4lfgzJtgYkfw9JuyKO_WZd0ie7jjd7EWn653VY0rqAJuMT4U6EMb4gPG272EL2rqtBH_6rf6Rspq7-LoazslK_diERn2CFkCJLot82U_jI4KCMbZYMuAEbgtvHeLf5TPUv38uxERGasu4TIKIHYk9u2Ztelq-DXZBvRtNNyp0tkIk6l0uu63X1vZb9sK2GCYVan4haBR1STxtMHaDrunFr9TC_IbLXNV-FPoQSWwf3dATXQCRtFs490NgJmM6MKcAEk60f2cBOSLNrwfl7eAlMH57VeiMDokbmwNEsJDP1qcVc3kkYkCbceZNMqXYfGCOAiFvSy7ZJfh0SIbxkQrmqo94E_GfeyBkw9gV5bg6N349AJZxrr4rODWmkhtRU0OSMFImt1Kq9Qh2YO5RjBpfnBIdhJ7m1g07TVW0gcCj9vtvEU8sI42eh2HC_Cc2hWpGyjOlO-CFNwTl95mABgiT83W03y2jMkTFSd2LLs8Ln_gVY";

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