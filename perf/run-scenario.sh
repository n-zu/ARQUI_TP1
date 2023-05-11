#!/bin/sh
npm run artillery -- run scenarios/$1.yaml -e $2
