echo "Starting deployment..."
echo ""
cd /projects/fitness-tracker/apps/frontend
npm run build
sudo rm -rf /var/www/fitness-tracker/*
sudo cp -r dist/* /var/www/fitness-tracker/
sudo chown -R www-data:www-data /var/www/fitness-tracker
sudo systemctl reload nginx
echo ""
echo "UI Deployment complete!"