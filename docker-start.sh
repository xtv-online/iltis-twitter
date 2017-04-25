#!/usr/bin/env bash
mkdir /data/logs

rethinkdb --bind all &> /data/logs/rethinkdb.log &

cd /data/xtv-collator && npm i && NODE_ENV=dev npm run start &> /data/logs/application.log &

bash
