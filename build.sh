#!/bin/bash

# Nume proiect
project_name="devcenter"

# Opțiuni de build
run="node index.js"
build="npm install"

# Afișarea meniului de opțiuni
echo "============================================="
echo "Proiect: $project_name"
echo "============================================="
echo "Selectează o opțiune:"
echo "1. Run (rulare aplicație JS)"
echo "2. Build (construire executabil JS)"

# Citirea alegerii utilizatorului
read -p "Introdu numărul opțiunii tale: " choice

# Executarea opțiunii selectate
if [ "$choice" == "1" ]; then
    echo "Rulăm aplicația JS..."
    $run
elif [ "$choice" == "2" ]; then
    echo "Instalăm dependentele JS..."
    $build
else
    echo "Alegere invalidă. Te rog să încerci din nou."
fi
