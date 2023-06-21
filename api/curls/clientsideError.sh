


json=`curl localhost:4000/user/login -H "Content-Type: application/json" -d '{"username": "testx","password": "password"}'`
token=`echo $json | jq -r ".token"`
echo $token
auth="Authorization: Bearer $token"

echo "$auth"
curl localhost:4000/log/clientsideError -H "Content-Type: application/json" -H "$auth" -d '{"message": "w,,,hat?", "route": "fake,route"}' 
