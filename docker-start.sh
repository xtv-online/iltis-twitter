#!/usr/bin/env bash
mkdir /data/logs

rethinkdb --bind all &> /data/logs/rethinkdb.log &

cd /data/xtv-collator && NODE_ENV=production npm run start &> /data/logs/application.log &

bash
