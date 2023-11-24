#!/usr/bin/env bash
# scripts/start-test-db.sh

# remove unused containers
docker-compose -f ./database/docker-compose-test.yml down
docker-compose -f ./database/docker-compose.yml down
# start database
docker-compose -f ./database/docker-compose-test.yml up -d
timeout 15s bash -c "until docker exec postgres_container_test  pg_isready ; do sleep 1 ; done"
npx prisma migrate dev --name init