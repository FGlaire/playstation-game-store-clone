# PlayStation Games Store Clone

A modern, responsive PlayStation games store clone built with Next.js 14, Supabase, and Tailwind CSS. This project is for educational purposes only.

## Features

- 🎮 Browse PlayStation games
- 🛒 Shopping cart functionality
- 👤 User authentication
- 🔐 Admin dashboard
- 💳 Checkout process
- 🎨 Modern UI with smooth animations
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Animations**: Framer Motion
- **State Management**: React Context

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/ps-store.git
cd ps-store
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

1. Create a new Supabase project
2. Use the SQL schema provided in `supabase/schema.sql`
3. Set up the following tables:
   - users (handled by Supabase Auth)
   - games
   - orders
   - cart_items

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Disclaimer

This is not the official PlayStation Store. This project is created for educational purposes only and is not affiliated with Sony Interactive Entertainment Inc. or PlayStation in any way.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
