const axios = require("axios");

n = parseInt(process.env.NUM_REQUESTS) || 100;
const localUrl = "http://localhost:4000/proxy";
const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2ViYzc5NjYxNmRiZDU2M2RhMWM1NDYiLCJ1c2VybmFtZSI6IkRhbHRhMSIsInJvbGUiOiJTVFVERU5UIiwibGFuZ3VhZ2UiOiJnYSIsImV4cCI6MTY4MDEwODg1NC43NzIsImlhdCI6MTY3OTUwNzY1NH0.lYzxTvpB06NXKWniqe-4Jacvsw2m-TX4wjQVA2_dw9bbfsv6Yq_iCnZQ61KlhR_jPF4YdGK9wUIVcVqPNaancfundbs6pGy8Qie8ijmEMzRqfLBq1UC8zoMWqZTX2nyd52ctvwxIRQLJRDorE0zR7JvUGHYITNe_DI2MxrfwJU0f0jzzb0TAKcN5qr_Mdnvh_tqyJHd9hhJzhhG_rKWPVf96vDahZDuMAnxvAN0XHO4-DHMR5DRHwC821NbU6PH9nigTlS6J2oN1P_WoWKCNu0Ev50eQIxgRvuP4QrEPlvLjGiTw_oWWBk9KvLdZuINAmsXOdO2y1pW2g7ypS3IjsGy5bskLdjNsSlrxv6fQz5uU5jFNUMgQH9GggazCtqkn5_96NSoYTD3EYtX4y7NjxK-1gAWWHhi7Wv1xObHpI5W2RBgiRdMtUdC4awj25wE7NGKDW4bfTjZIp6AsbGtb1aLWG35p5K-C2A0478ZZlNqGBwR9D5XzoxI12CpdHWTMUsijde6TOjtm8aJ4FPiPNF5rPPddVhdewDI_2nB0Ui9qyrlwCAkgVRySzjAhinY5uGWOXGYTnQpm-lrx4ONTs0UPzRF4ynJXrbL93W14vaTVJ3rg33w1SsgzgbeLcNdbY2oInnuy77bQBN46K9yxCyEGLSFcSI06flisasAit-8";

const voices = [
	"ga_UL_anb_nnmnkwii",
	"ga_UL_anb_nemo"
]

const fromObject = {
	input: "dia dhuit a cara",
	voice: voices[1],
	audioEncoding: "MP3",
	outputType: 'JSON',
};

const config = {
	headers:{
	  'Authorization': 'Bearer ' + authToken,
	}
  };

callLocalServer();

/**
 * Hit the Abair API directly
 * https://www.abair.ie/api2/synthesise?
 */
async function callAbairServer() {
	console.time("runtime");

	let success = 0;
	let fail = 0;

	await Promise.all(Array(n).fill(undefined).map(async ()=>{
		return axios.get(request(fromObject))
			.then(r=>{success++; console.log(r.data)}, () => {fail++;});
	}));

	console.log("SUCCESS: ", success);
	console.log("FAIL:    " , fail);
	console.timeEnd("runtime");
}

/**
 * Hit the Abair API going through the An Scéalaí server (as done on frontend)
 * http://localhost:4000/proxy => https://www.abair.ie/api2/synthesise?
 */
async function callLocalServer() {
	console.time("runtime");

	let success = 0;
	let fail = 0;
	let body = request(fromObject);

	await Promise.all(Array(n).fill(undefined).map(async ()=>{
		return axios.post(localUrl, {url: body}, config)
			.then(r=>{success++; console.log(r.data)}, () => {fail++;});
	}));

	console.log("SUCCESS: ", success);
	console.log("FAIL:    " , fail);
	console.timeEnd("runtime");
}

function request(params) {
	var queryString = Object.keys(params).map((key) => {
	    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
	}).join('&');
	return "https://www.abair.ie/api2/synthesise?" + queryString;
}
