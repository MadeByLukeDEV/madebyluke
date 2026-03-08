#!/usr/bin/env bash
# setup-local.sh — run once to get your local dev environment ready
set -e

echo ""
echo "🚀 madebyluke.dev — Local Setup"
echo "================================"

# 1. Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
  echo "❌ Node.js 22+ required. Current: $(node -v)"
  exit 1
fi
echo "✅ Node.js $(node -v)"

# 2. Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm ci

# 3. Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
  echo ""
  echo "⚙️  Creating .env.local from template..."
  cp .env.example .env.local
  
  # Generate a random JWT secret
  JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
  
  # Replace placeholder in .env.local
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/your-super-secret-jwt-key-here/$JWT_SECRET/" .env.local
  else
    sed -i "s/your-super-secret-jwt-key-here/$JWT_SECRET/" .env.local
  fi

  echo "✅ .env.local created with generated JWT_SECRET"
  echo "⚠️  Edit .env.local and fill in your DATABASE_URL and RESEND_API_KEY"
else
  echo "✅ .env.local already exists"
fi

# 4. Generate Prisma client
echo ""
echo "🗄️  Generating Prisma client..."
npx prisma generate

# 5. Check if DB is reachable and run migrations
echo ""
echo "🗄️  Running database migrations..."
if npx prisma migrate dev --name init 2>/dev/null; then
  echo "✅ Database migrated"
else
  echo "⚠️  Could not run migrations — make sure DATABASE_URL in .env.local is correct"
  echo "   Run manually: npx prisma migrate dev"
fi

echo ""
echo "✅ Setup complete! Start dev server with:"
echo "   npm run dev"
echo ""
echo "   Portfolio: http://localhost:3000"
echo "   Dashboard: http://localhost:3000/dashboard/login"
echo ""
