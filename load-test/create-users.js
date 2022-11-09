const axios = require("axios");

function url(p) {
	return "https://www.abair.ie/anscealaibackend" + p;
}

(async()=>{
	for(let n = 0; n < 50; n++) {
		const body = {
			username: "loadTestUser" + n,
			email: "nrobinso@tcd.ie",
			password: "loadTestPassword",
			role: "STUDENT",
			baseurl: "https://www.abair.ie/anscealaibackend",
		};
		const r = await axios.post(url("/user/register"),body)
			.catch(console.error);
	}
})();
