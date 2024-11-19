#!/bin/bash
if ! command -v openssl &> /dev/null
then
    echo "OpenSSL is not installed. Attempting to install..."
    if [[ -x "$(command -v apt)" ]]; then
        sudo apt update && sudo apt install -y openssl
    elif [[ -x "$(command -v yum)" ]]; then
        sudo yum install -y openssl
    elif [[ -x "$(command -v dnf)" ]]; then
        sudo dnf install -y openssl
    elif [[ -x "$(command -v pacman)" ]]; then
        sudo pacman -Syu openssl --noconfirm
    else
        echo "No compatible package manager detected. Please install OpenSSL manually."
        exit 1
    fi
    if command -v openssl &> /dev/null
    then
        echo "OpenSSL was successfully installed."
    else
        echo "OpenSSL installation failed. Please check for errors."
        exit 1
    fi
else
    echo "OpenSSL is already installed."
fi
prompt_for_input() {
    local var_name=$1
    local prompt_text=$2
    local default_value=$3
    read -p "$prompt_text [$default_value]: " input_value
    export "$var_name"="${input_value:-$default_value}"
}
echo "Set SSL Certificate parameters:"
prompt_for_input ORG_NAME "Organization Name" "SpargatTeam"
prompt_for_input DOMAIN_NAME "Domain Name" "localhost"
prompt_for_input DAYS_VALID "Days Valid" "365"
prompt_for_input COUNTRY "Country Code (2 letters)" "US"
prompt_for_input STATE "State" "State"
prompt_for_input CITY "City" "City"
openssl req -nodes -new -x509 -keyout server.key -out server.cert -days "$DAYS_VALID" -subj "/C=$COUNTRY/ST=$STATE/L=$CITY/O=$ORG_NAME/CN=$DOMAIN_NAME"
echo -e "\nSSL Certificate and Key generated:"
echo "Private Key: server.key"
echo "Certificate: server.cert"