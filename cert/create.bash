#!/bin/bash
ORG_NAME="SpargatTeam"
DOMAIN_NAME="localhost"
DAYS_VALID=365 
COUNTRY="US"
STATE="State"
CITY="City"
openssl req -nodes -new -x509 -keyout server.key -out server.cert -days $DAYS_VALID -subj "/C=$COUNTRY/ST=$STATE/L=$CITY/O=$ORG_NAME/CN=$DOMAIN_NAME"
echo "SSL Certificate and Key generated:"
echo "Private Key: server.key"
echo "Certificate: server.cert"