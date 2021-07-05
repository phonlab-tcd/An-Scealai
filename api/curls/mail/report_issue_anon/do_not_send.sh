curl -X POST -H "Content-Type: application/json" -i\
  -d "{\
  \"message\": \"do not send this message please\", \
  \"do_not_send\": 1, \
  \"subject\": \"This email should never be sent\"\
}" \
http://localhost:4000/mail/report_issue_anon
