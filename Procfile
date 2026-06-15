web: npm run start -w @muslim-hebat/api
release: sh -c 'for i in 1 2 3 4 5; do npx prisma migrate deploy --schema apps/api/prisma/schema.prisma && exit 0; echo "Retry $i/5..."; sleep 5; done; exit 1'
