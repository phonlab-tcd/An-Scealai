import { Request } from "request";

// this function depends on properly configuring any reverse proxies to forward
// the Host header, i.e. in nginx with
// proxy_set_header Host $host;
export default function base_url(req: Request) {
	return `https://${req.hostname}/api`;
}
