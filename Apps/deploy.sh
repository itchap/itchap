#!/bin/bash

USER_HOME="/home/ubuntu"
REPO_DIR="$USER_HOME/itchap"

# Check if an argument was provided
if [ -z "$1" ]; then
  echo "❌ Error: Please specify an app to deploy, or use 'all'."
  echo "📌 Usage: sudo ./deploy.sh [app_name]"
  echo "📦 Available apps: homepage, skills, trust, learning, pyramid, blog, dealsheets, all"
  exit 1
fi

APP_TARGET=$1

echo "📥 Pulling latest code from GitHub..."
cd $REPO_DIR
sudo -u ubuntu git pull origin main
echo "✅ Code updated."

# --- DEPLOYMENT FUNCTIONS ---

deploy_homepage() {
  echo "🏠 Building Homepage Frontend..."
  cd $REPO_DIR/Apps/homepage
  npm install --no-audit --no-fund
  npm run build
  echo "🚚 Moving Homepage to Apache Root..."
  sudo rm -rf /var/www/html/*
  sudo cp -r dist/* /var/www/html/
  sudo chown -R www-data:www-data /var/www/html
}

deploy_skills() {
  echo "⚙️ Updating Skills Matrix Backend..."
  rsync -av --exclude='node_modules' $REPO_DIR/Apps/skill-passion/backend/ /var/www/skills-matrix/backend/
  cd /var/www/skills-matrix/backend
  npm install --no-audit --no-fund
  sudo -u ubuntu pm2 start server.js --name "skills-backend" || sudo -u ubuntu pm2 restart "skills-backend"

  echo "🎨 Building Skills Matrix Frontend..."
  cd $REPO_DIR/Apps/skill-passion/frontend
  npm install --no-audit --no-fund
  npm run build
  echo "🚚 Moving Skills app to Apache..."
  sudo rm -rf /var/www/skills-matrix/frontend/dist/*
  sudo cp -r dist/* /var/www/skills-matrix/frontend/dist/
  sudo chown -R www-data:www-data /var/www/skills-matrix/frontend/dist
}

deploy_trust() {
  echo "⚙️ Updating Trust Rater Backend..."
  rsync -av --exclude='node_modules' $REPO_DIR/Apps/trust-rater/backend/ /var/www/trust-rater/backend/
  cd /var/www/trust-rater/backend
  npm install --no-audit --no-fund
  sudo -u ubuntu pm2 start server.js --name "trust-backend" || sudo -u ubuntu pm2 restart "trust-backend"

  echo "🤝 Building Trust Rater Frontend..."
  cd $REPO_DIR/Apps/trust-rater
  npm install --no-audit --no-fund
  npm run build
  echo "🚚 Moving Trust Rater to Apache..."
  sudo mkdir -p /var/www/trust-rater/dist
  sudo rm -rf /var/www/trust-rater/dist/*
  sudo cp -r dist/* /var/www/trust-rater/dist/
  sudo chown -R www-data:www-data /var/www/trust-rater/dist
}

deploy_learning() {
  echo "🧠 Building Learning Cycle Frontend..."
  cd $REPO_DIR/Apps/learning-cycle
  npm install --no-audit --no-fund
  npm run build
  echo "🚚 Moving Learning Cycle to Apache..."
  sudo mkdir -p /var/www/learning-cycle
  sudo rm -rf /var/www/learning-cycle/*
  sudo cp -r dist/* /var/www/learning-cycle/
  sudo chown -R www-data:www-data /var/www/learning-cycle
}

deploy_pyramid() {
  echo "🔺 Building Value Pyramid Frontend..."
  cd $REPO_DIR/Apps/value-pyramid/frontend
  npm install --no-audit --no-fund
  npm run build
  echo "🚚 Moving Value Pyramid to Apache..."
  sudo mkdir -p /var/www/value-pyramid/dist
  sudo rm -rf /var/www/value-pyramid/dist/*
  sudo cp -r dist/* /var/www/value-pyramid/dist/
  sudo chown -R www-data:www-data /var/www/value-pyramid/dist
}

deploy_blog() {
  echo "📝 Updating Blog Backend..."
  sudo mkdir -p /var/www/blog/backend
  rsync -av --exclude='node_modules' $REPO_DIR/Apps/blog/backend/ /var/www/blog/backend/
  cd /var/www/blog/backend
  npm install --no-audit --no-fund
  sudo -u ubuntu pm2 start server.js --name "blog-backend" || sudo -u ubuntu pm2 restart "blog-backend"

  echo "🎨 Building Blog Frontend..."
  cd $REPO_DIR/Apps/blog/frontend
  npm install --no-audit --no-fund
  npm run build
  echo "🚚 Moving Blog Frontend to Apache..."
  sudo mkdir -p /var/www/blog/frontend/dist
  sudo rm -rf /var/www/blog/frontend/dist/*
  sudo cp -r dist/* /var/www/blog/frontend/dist/
  sudo chown -R www-data:www-data /var/www/blog/frontend/dist
}

deploy_dealsheets() {
  echo "📝 Updating Deal Sheets Backend..."
  sudo mkdir -p /var/www/dealsheets/backend
  rsync -av --exclude='node_modules' $REPO_DIR/Apps/dealsheets/backend/ /var/www/dealsheets/backend/
  cd /var/www/dealsheets/backend
  npm install --no-audit --no-fund
  sudo -u ubuntu pm2 start server.js --name "dealsheets-backend" || sudo -u ubuntu pm2 restart "dealsheets-backend"

  echo "🎨 Building Deal Sheets Frontend..."
  cd $REPO_DIR/Apps/dealsheets/frontend
  npm install --no-audit --no-fund
  npm run build
  echo "🚚 Moving Deal Sheets Frontend to Apache..."
  sudo mkdir -p /var/www/dealsheets/frontend/dist
  sudo rm -rf /var/www/dealsheets/frontend/dist/*
  sudo cp -r dist/* /var/www/dealsheets/frontend/dist/
  sudo chown -R www-data:www-data /var/www/dealsheets/frontend/dist
}

# --- ROUTER (The Switchboard) ---

case "$APP_TARGET" in
  "homepage")
    deploy_homepage
    ;;
  "skills")
    deploy_skills
    ;;
  "trust")
    deploy_trust
    ;;
  "learning")
    deploy_learning
    ;;
  "pyramid")
    deploy_pyramid
    ;;
  "blog")
    deploy_blog
    ;;
  "dealsheets")
    deploy_dealsheets
    ;;
  "all")
    deploy_homepage
    deploy_skills
    deploy_trust
    deploy_learning
    deploy_pyramid
    deploy_blog
    deploy_dealsheets
    ;;
  *)
    echo "❌ Unknown app: '$APP_TARGET'"
    echo "📦 Available apps: homepage, skills, trust, learning, pyramid, blog, dealsheets, all"
    exit 1
    ;;
esac

echo "✅ Target '$APP_TARGET' successfully deployed and live!"