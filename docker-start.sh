#!/usr/bin/env bash

rethinkdb --bind all &> /data/logs/rethinkdb.log &

cd /data/iltis-twitter && NODE_ENV=production npm run start &> /data/logs/application.log

# bash
