# Database Setup Guide

## 1. Environment Configuration

Create a `.env.local` file in your project root with your database connection string:

```bash
# PostgreSQL
DATABASE_URL="postgresql://username:password@host:port/database_name"

# MySQL
DATABASE_URL="mysql://username:password@host:port/database_name"

# SQLite (for development)
DATABASE_URL="file:./dev.db"
```

## 2. Database Provider Setup

### PostgreSQL
1. Install PostgreSQL on your system or use a cloud service (AWS RDS, Supabase, etc.)
2. Create a database
3. Update the `provider` in `prisma/schema.prisma` to `"postgresql"`

### MySQL
1. Install MySQL on your system or use a cloud service (AWS RDS, PlanetScale, etc.)
2. Create a database
3. Update the `provider` in `prisma/schema.prisma` to `"mysql"`

### SQLite (Development)
1. No additional setup required
2. Update the `provider` in `prisma/schema.prisma` to `"sqlite"`

## 3. Database Migration

After setting up your database connection:

```bash
# Generate Prisma client
npx prisma generate

# Create and apply database migrations
npx prisma migrate dev --name init

# (Optional) View your database in Prisma Studio
npx prisma studio
```

## 4. Popular Cloud Database Options

### Supabase (PostgreSQL)
- Free tier available
- Easy setup with dashboard
- Connection string format: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

### PlanetScale (MySQL)
- Free tier available
- Serverless MySQL
- Connection string format: `mysql://[USERNAME]:[PASSWORD]@[HOST]/[DATABASE]?sslaccept=strict`

### Neon (PostgreSQL)
- Free tier available
- Serverless PostgreSQL
- Connection string format: `postgresql://[USERNAME]:[PASSWORD]@[HOST]/[DATABASE]`

## 5. Troubleshooting

- Ensure your database is accessible from your application
- Check firewall settings and network access
- Verify connection string format
- Run `npx prisma db push` for quick schema updates during development
