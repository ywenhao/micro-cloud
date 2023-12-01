#!/bin/bash
node -v
npm install -g pnpm
pnpm install
pnpm docs:build

echo "Copy Folder..."

rm -rf "/home/user1/workspaces/nginx/www/vc-material"

mkdir "/home/user1/workspaces/nginx/www/vc-material"

cp -r ./site/.vitepress/dist/* "/home/user1/workspaces/nginx/www/vc-material/"

echo "Copy Nginx Config..."
cp ./vc-material.conf "/home/user1/workspaces/nginx/conf.d/"

echo "It's done √"

docker exec -i nginx /bin/sh -c "nginx -s reload"


