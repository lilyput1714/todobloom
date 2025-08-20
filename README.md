# TodoBloom

A modern, feature-rich todo application built with Next.js, featuring drag-and-drop functionality, database persistence, and a beautiful UI.

## Features

- ✨ **Modern UI/UX** - Built with Tailwind CSS and Radix UI components
- 🗂️ **Database Integration** - SQL database support with Prisma ORM
- 🔄 **Real-time Updates** - Instant database synchronization
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎯 **Drag & Drop** - Reorder todos with intuitive drag and drop
- 📅 **Due Date Support** - Set and track due dates for tasks
- 📊 **Export Functionality** - Download completed tasks as PDF
- 🎨 **Beautiful Animations** - Smooth transitions and interactions

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: Prisma ORM with SQL support (PostgreSQL, MySQL, SQLite)
- **State Management**: React hooks with custom database integration
- **Drag & Drop**: @dnd-kit
- **PDF Generation**: jsPDF, html2canvas

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- SQL database (PostgreSQL, MySQL, or SQLite)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd todobloom
```

2. Install dependencies:
```bash
npm install
```

3. Set up your database:
   - Create a `.env.local` file with your database connection string
   - See `DATABASE_SETUP.md` for detailed instructions

4. Set up the database:
```bash
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run database migrations
npm run db:seed        # Seed with sample data (optional)
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:9002](http://localhost:9002) in your browser

## Database Setup

This application supports multiple SQL databases:

- **PostgreSQL** (recommended for production)
- **MySQL** 
- **SQLite** (great for development)

See `DATABASE_SETUP.md` for detailed setup instructions for each database type.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   │   └── todos/      # Todo CRUD endpoints
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/          # React components
│   ├── todo/           # Todo-specific components
│   └── ui/             # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
└── types.ts            # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
