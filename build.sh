#!/bin/bash

project_name="DevCenter"
run="npm run build"
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
    $run
elif [ "$choice" == "2" ]; then
    echo "Installing depencies..."
    $build
    pip install cryptography
else
    echo "Invalid option"
fi