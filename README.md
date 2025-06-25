# Space Dashboard

A modern web application that provides real-time space data, astronomy information, and celestial discoveries. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Astronomy Picture of the Day (APOD)**: View NASA's daily featured space image with detailed explanations
- **Near-Earth Objects (NEO)**: Track asteroids and comets that approach Earth's orbit
- **Real-time Data**: Live updates from NASA APIs
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Theme**: Space-themed dark interface

## Tech Stack

- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (for data caching)
- **APIs**: NASA APIs (APOD, NEO)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- NASA API key (get one at [api.nasa.gov](https://api.nasa.gov))
- Supabase account (optional, for data caching)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd space-dashboard
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Add your environment variables:

```env
NASA_API_KEY=your_nasa_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional: Supabase for data caching
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── apod/         # Astronomy Picture of the Day API
│   │   └── neo/          # Near-Earth Objects API
│   ├── apod/             # APOD page
│   ├── dashboard/        # Main dashboard
│   ├── neo/              # NEO tracking page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
└── lib/                  # Utility libraries
    └── supabase.ts       # Supabase client
```

## API Endpoints

- `GET /api/apod` - Fetch today's Astronomy Picture of the Day
- `GET /api/neo` - Fetch Near-Earth Objects data
  - Query params: `start` (YYYY-MM-DD), `end` (YYYY-MM-DD)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [NASA APIs](https://api.nasa.gov) for providing space data
- [Next.js](https://nextjs.org) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for the styling system
