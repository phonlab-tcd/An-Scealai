const axios = require("axios");

n = parseInt(process.env.NUM_REQUESTS) || 20;
const abairUrl = "https://www.abair.ie/anscealaibackend/proxy";

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

function request(params) {
	var queryString = Object.keys(params).map((key) => {
	    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
	}).join('&');
	return "https://www.abair.ie/api2/synthesise?" + queryString;
}

Array(n).fill(undefined).forEach(async (_x,i)=>{
	await axios.get(request(fromObject))
		.then(r=>{console.log(r.data)}, console.log);
});
