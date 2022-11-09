const axios = require("axios");
require("dotenv").config();

password = process.env.password;

function url(p) {
	return "https://www.abair.ie/anscealaibackend" + p;
}

async function loginAs(n) {
	const body = {
		username: "loadTestUser" + n,
		password,
	};

	const r = await axios.post(url("/user/login"), body);
	return r;
}

async function createStoryAs(user) {
	const body = {
		user: user,
		title: "random title",
		htmlText: "random random random text",
	};
	const headers = {
		Authorization: "Bearer " + user.token,
	};
	return await axios.post(url("/story/create"),body,{headers}).catch(e=>{
		console.error(e.message)
	});
}

function n_times(n,f) {
	return Array(n).fill(undefined).map(_x=>f());
}

function getStoriesOf(user) {
	const headers = {
		Authorization: "Bearer " + user.token,
	};
	return axios.get(url("/story/owner/" + user._id), {headers});

}

async function runSeriesAs(user) {
	const stories = await Promise.all(n_times(100, ()=>createStoryAs(user)));
}

function atob(a) {
	return new Buffer(a,'base64').toString('binary');
}

function updateStoryOfUser(story,user) {
	const headers = {
		Authorization: "Bearer " + user.token,
	};
	return axios.post(url("/story/update/" + story._id), {text: Math.random().toString()}, {headers});
}

(async()=>{
	const users = await Promise.all(
		Array(1).fill(undefined).map(async (x,n)=>{
			const r = await loginAs(n)
			const user = JSON.parse(atob(r.data.token.split('.')[1]));
			return {
				token: r.data.token,
				...user,
			}
		})
	);
	users.forEach(u=>{
		getStoriesOf(u).then(
			stories=>{
				console.log(stories);
				stories.data.forEach(s=>{
					updateStoryOfUser(s,u).then(
						()=>console.log("success"),
						()=>console.log("fail"),
					);
				});
			},
			console.error,
		);
	});
})();
