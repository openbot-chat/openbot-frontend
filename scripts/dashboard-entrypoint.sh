#!/bin/bash

cd apps/dashboard;
node  -e "const { configureRuntimeEnv } = require('next-runtime-env/build/configure'); configureRuntimeEnv();"
cd ../..;

echo 'Waiting for 15s for database to be ready...';
sleep 15;

# ./node_modules/.bin/prisma migrate deploy --schema=packages/prisma/postgresql/schema.prisma;

HOSTNAME=0.0.0.0 PORT=3000 node apps/dashboard/server.js;