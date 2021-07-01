curl -X POST -H "Content-Type: application/json" -i\
  -d "{\
  \"message\": \"Hello World!\", \
  \"subject\": \"Hello World!\"\
}" \
http://localhost:4000/mail/report_issue_anon
