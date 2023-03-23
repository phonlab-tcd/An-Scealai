const axios = require("axios");

n = parseInt(process.env.NUM_REQUESTS) || 10;
const abairUrl = "http://localhost:4000/gramadoir/callAnGramadoir/" + encodeURIComponent('mo madra'); // currently served version
const dockerUrl = "http://localhost:4000/gramadoir/callAnGramadoirDocker/" + encodeURIComponent('mo madra');
const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2ViYzc5NjYxNmRiZDU2M2RhMWM1NDYiLCJ1c2VybmFtZSI6IkRhbHRhMSIsInJvbGUiOiJTVFVERU5UIiwibGFuZ3VhZ2UiOiJnYSIsImV4cCI6MTY4MDEwODg1NC43NzIsImlhdCI6MTY3OTUwNzY1NH0.lYzxTvpB06NXKWniqe-4Jacvsw2m-TX4wjQVA2_dw9bbfsv6Yq_iCnZQ61KlhR_jPF4YdGK9wUIVcVqPNaancfundbs6pGy8Qie8ijmEMzRqfLBq1UC8zoMWqZTX2nyd52ctvwxIRQLJRDorE0zR7JvUGHYITNe_DI2MxrfwJU0f0jzzb0TAKcN5qr_Mdnvh_tqyJHd9hhJzhhG_rKWPVf96vDahZDuMAnxvAN0XHO4-DHMR5DRHwC821NbU6PH9nigTlS6J2oN1P_WoWKCNu0Ev50eQIxgRvuP4QrEPlvLjGiTw_oWWBk9KvLdZuINAmsXOdO2y1pW2g7ypS3IjsGy5bskLdjNsSlrxv6fQz5uU5jFNUMgQH9GggazCtqkn5_96NSoYTD3EYtX4y7NjxK-1gAWWHhi7Wv1xObHpI5W2RBgiRdMtUdC4awj25wE7NGKDW4bfTjZIp6AsbGtb1aLWG35p5K-C2A0478ZZlNqGBwR9D5XzoxI12CpdHWTMUsijde6TOjtm8aJ4FPiPNF5rPPddVhdewDI_2nB0Ui9qyrlwCAkgVRySzjAhinY5uGWOXGYTnQpm-lrx4ONTs0UPzRF4ynJXrbL93W14vaTVJ3rg33w1SsgzgbeLcNdbY2oInnuy77bQBN46K9yxCyEGLSFcSI06flisasAit-8";
//const abairUrl = "https://www.abair.ie/cgi-bin/api-gramadoir-1.0.pl";

main(dockerUrl);

/**
 * Load test the An Gramadoir hosted on phoneticsrv3 or locally with Docker
 * Need an authToken from a logged-in user for phoneticsrv3
 */
async function main(url) {
	console.time("runtime");

	let success = 0;
	let fail = 0;

	const config = {
		headers:{
		  'Authorization': 'Bearer ' + authToken,
		}
	  };

	await Promise.all(Array(n).fill(undefined).map(async ()=>{
		return axios.post(url, null, config)
			.then(r=>{success++; console.log(r.data)}, () => {fail++;});
	}));
	console.log("SUCCESS: ", success);
	console.log("FAIL:    " , fail);
	console.timeEnd("runtime");
}