console.log(process.env);
const jwt_priv = process.env.JWT_RS256_PRIVATE_KEY;
const jwt_pub = process.env.JWT_RS256_PUBLIC_KEY;
if(!jwt_priv) throw new Error("no private signing key");
if(!jwt_pub) throw new Error("no public signing key");
process.env.PRIVATE_KEY = Buffer.from(jwt_priv,"base64").toString("ascii");
process.env.PUBLIC_KEY = Buffer.from(jwt_pub,"base64").toString("ascii");

export default process.env;