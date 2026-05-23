echo "Starting deployment..."
echo ""
echo "Building shared types package..."
echo ""
cd /projects/fitness-tracker
pnpm --filter @fitness-tracker/shared-types build

echo "Stopping frontend service..."
echo ""
pm2 stop ft:fe
cd /projects/fitness-tracker/apps/frontend
echo "Clearing old build files and building new ones..."
echo ""
sudo rm -rf dist/*
pnpm i
pnpm build
pm2 start ft:fe
echo ""
echo "Frontend Deployment complete!"

echo "Stopping backend service..."
echo ""
pm2 stop ft:be
cd /projects/fitness-tracker/apps/backend
echo "Clearing old build files and building new ones..."
echo ""
sudo rm -rf dist/*
pnpm i
pnpm build
pnpm db:generate
pnpm db:migrate
pm2 start ft:be

sudo systemctl reload nginx
echo ""
echo "Backend Deployment complete!"