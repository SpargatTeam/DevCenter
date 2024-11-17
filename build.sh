#!/bin/bash
project_name="DevCenter"
run="sudo env "PATH=$PATH:/home/comical/.nvm/versions/node/v22.11.0/bin" npm run build"
build="npm install"
echo "============================================="
echo "Project: $project_name"
echo "============================================="
echo "Choice an option:"
echo "1. Run (DevCenter)"
echo "2. Install (depencies)"
read -p "Run option: " choice
if [ "$choice" == "1" ]; then
    echo "Running DevCenter..."
    which npm
    $run
elif [ "$choice" == "2" ]; then
    echo "Installing depencies..."
    $build
else
    echo "Invalid option"
fi