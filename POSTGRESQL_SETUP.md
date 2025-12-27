# 🐘 PostgreSQL Setup Guide

## Quick Setup

### Option 1: Local PostgreSQL

1. **Install PostgreSQL**
   ```bash
   # macOS (using Homebrew)
   brew install postgresql
   brew services start postgresql

   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql

   # Windows
   Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**
   ```bash
   # Connect to PostgreSQL
   psql postgres

   # Create database and user
   CREATE DATABASE lion_car_sale;
   CREATE USER your_username WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE lion_car_sale TO your_username;
   \q
   ```

3. **Update .env file**
   ```env
   DATABASE_URL=postgresql://your_username:your_password@localhost:5432/lion_car_sale
   ```

4. **Test Connection**
   ```bash
   cd backend
   npm run test-db
   ```

5. **Initialize Database**
   ```bash
   npm start
   # Tables will be created automatically
   ```

6. **Seed Sample Data (Optional)**
   ```bash
   npm run seed
   ```

### Option 2: Cloud PostgreSQL (Recommended for Production)

#### Using Railway
1. Go to https://railway.app
2. Create new project → Add PostgreSQL
3. Copy the `DATABASE_URL` from Railway
4. Add to your `.env` file

#### Using Render
1. Go to https://render.com
2. New → PostgreSQL
3. Copy the `Internal Database URL` or `External Database URL`
4. Add to your `.env` file

#### Using Supabase (Free Tier)
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy the connection string
5. Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
6. Add to your `.env` file

#### Using Neon (Free Tier)
1. Go to https://neon.tech
2. Create new project
3. Copy the connection string
4. Add to your `.env` file

## Connection String Format

```
postgresql://username:password@host:port/database
```

Examples:
- Local: `postgresql://postgres:mypassword@localhost:5432/lion_car_sale`
- Cloud: `postgresql://user:pass@host.provider.com:5432/dbname?sslmode=require`

## Environment Variables

Create `.env` file in `backend` folder:

```env
PORT=5001
DATABASE_URL=postgresql://username:password@localhost:5432/lion_car_sale
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Database Schema

The application automatically creates the following table:

**vehicles**
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR)
- `make` (VARCHAR)
- `model` (VARCHAR)
- `year` (INTEGER)
- `price` (DECIMAL)
- `images` (TEXT[])
- `description` (TEXT)
- `mileage` (INTEGER)
- `color` (VARCHAR)
- `fuel_type` (VARCHAR)
- `transmission` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running
- Check if port 5432 is correct
- Verify host address

### Authentication Failed
- Check username and password
- Verify user has access to the database
- Check pg_hba.conf for authentication method

### Database Does Not Exist
- Create database: `CREATE DATABASE lion_car_sale;`
- Or use existing database name in connection string

### SSL Required (Cloud Databases)
- Add `?sslmode=require` to connection string
- Or set `ssl: { rejectUnauthorized: false }` in database config

## Useful Commands

```bash
# Test database connection
npm run test-db

# Seed sample data
npm run seed

# Connect to PostgreSQL (local)
psql -d lion_car_sale

# List all tables
\dt

# View vehicles table structure
\d vehicles

# Exit psql
\q
```

## Migration from MongoDB

If you were using MongoDB before:
1. ✅ All MongoDB code has been removed
2. ✅ PostgreSQL models are in place
3. ✅ Database schema is auto-created
4. ✅ Just update your `DATABASE_URL` and restart!

