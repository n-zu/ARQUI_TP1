#!/bin/bash

# Set the URL endpoint to send requests to
URL="http://localhost:5555/api/metar"

# Read the CSV file and loop through each row
while IFS=, read -r station
do
  # Send the HTTP request using curl with the parameters from the current row
  curl -s "${URL}?station=${station}"
done < stations.csv
