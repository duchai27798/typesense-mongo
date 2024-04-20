#!/bin/bash

[ -d data ] && rm -rf ./data

mkdir data
unzip -d data product-data.zip
echo "Unzip data successfully!"
