# Holy Bible Frontend

Modern, beautiful, and user-friendly web interface for reading and studying the Holy Bible.

## Features

- 📖 **Bible Reading** - Clean and distraction-free reading experience
- 🔍 **Search** - Powerful search functionality to find verses quickly
- 🔖 **Bookmarks** - Save your favorite verses for later
- 📝 **Annotations** - Add personal notes to verses
- 🌓 **Dark Mode** - Easy on the eyes for night reading
- 📱 **Responsive** - Works perfectly on all devices

## Tech Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS** - Styling
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:4000
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Button, Card, Input)
│   └── Layout.tsx   # Main layout with navigation
├── pages/           # Page components
│   ├── BibleReader.tsx
│   ├── SearchPage.tsx
│   ├── BookmarksPage.tsx
│   └── AuthPage.tsx
├── lib/             # Utilities and API client
│   ├── utils.ts
│   └── api.ts
└── App.jsx          # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend connects to the backend API running on `http://localhost:4000`. Make sure the backend is running before starting the frontend.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
