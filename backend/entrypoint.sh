#!/bin/sh

echo "waiting for db to be ready..."
sleep 3
npx prisma migrate deploy
node dist/index.js
