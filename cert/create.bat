@echo off
setlocal
set ORG_NAME=SpargatTeam
set DOMAIN_NAME=localhost
set DAYS_VALID=365
set COUNTRY=US
set STATE=State
set CITY=City
openssl req -nodes -new -x509 -keyout server.key -out server.cert -days %DAYS_VALID% -subj "/C=%COUNTRY%/ST=%STATE%/L=%CITY%/O=%ORG_NAME%/CN=%DOMAIN_NAME%"
echo SSL Certificate and Key generated:
echo Private Key: server.key
echo Certificate: server.cert
endlocal