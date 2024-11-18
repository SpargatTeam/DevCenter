#!/bin/bash
project_name="DevCenter"
required_node_version="22.11.0"
required_npm_version="10.9.0"
run=""
build="npm install"
echo "============================================="
echo "Project: $project_name"
echo "============================================="
check_version() {
    local current_version="$1"
    local required_version="$2"
    if [ "$(printf '%s\n' "$required_version" "$current_version" | sort -V | head -n1)" == "$required_version" ]; then
        return 0 
    else
        return 1 
    fi
}
node_path=$(which node)
npm_path=$(which npm)
if [ -z "$node_path" ] || [ -z "$npm_path" ]; then
    echo "Node.js or NPM not found. Installing them..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
    node_path=$(which node)
    npm_path=$(which npm)
fi
node_version=$("$node_path" -v | tr -d 'v')
npm_version=$("$npm_path" -v)
if ! check_version "$node_version" "$required_node_version"; then
    echo "Node.js version ($node_version) is not compatible. Installing the required version..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
if ! check_version "$npm_version" "$required_npm_version"; then
    echo "NPM version ($npm_version) is not compatible. Updating..."
    sudo npm install -g npm@"$required_npm_version"
fi
echo "Adding Node.js to PATH if necessary..."
node_bin_path=$(dirname "$node_path")
export PATH="$PATH:$node_bin_path"
run="sudo env PATH=$PATH npm run build"
echo "Choose an option:"
echo "1. Run (DevCenter)"
echo "2. Install dependencies"
read -p "Your choice: " choice
if [ "$choice" == "1" ]; then
    echo "Running DevCenter..."
    $run
elif [ "$choice" == "2" ]; then
    echo "Installing dependencies..."
    $build
else
    echo "Invalid option."
fi