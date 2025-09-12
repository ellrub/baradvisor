# Bergen Bar Advisor

A mobile-first web application for discovering the best bars in Bergen, Norway. Built with Next.js, Tailwind CSS, and Leaflet maps.

## Features

- 🗺️ **Interactive Map**: Explore bars on an interactive map of Bergen
- 📱 **Mobile-First Design**: Optimized for mobile devices with responsive design
- 🔍 **Search & Filter**: Search bars by name, description, or address
- 🏷️ **Category Filtering**: Filter by bar type (Cocktail Bar, Wine Bar, Pub, etc.)
- ❤️ **Favorites**: Save your favorite bars using local storage
- 🔄 **Sorting**: Sort bars by rating, name, or type
- 💾 **Local Storage**: Persistent favorites and user preferences

## Tech Stack

- **Frontend**: Next.js 15 with React
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with OpenStreetMap
- **Icons**: Lucide React
- **Data Storage**: Local Storage (no backend required)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd barAdvisor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── layout.js          # Root layout with mobile meta tags
│   ├── page.js            # Main application page
│   └── globals.css        # Global styles
├── components/
│   ├── BarCard.js         # Individual bar card component
│   └── Map.js             # Leaflet map component
├── data/
│   └── bars.js            # Static bar data for Bergen
└── hooks/
    └── useLocalStorage.js # Custom hooks for local storage
```

## Data Storage

The application uses local storage for:
- **Favorites**: User's favorite bars
- **Preferences**: Default view (list/map), sorting preferences
- **User Settings**: Persistent across sessions

No backend or database is required - all data is stored locally in the browser.

## Mobile Features

- Touch-friendly interface
- Optimized for small screens
- Responsive design that adapts to different screen sizes
- Mobile-specific meta tags for better mobile experience
- Fast loading with dynamic imports

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on mobile devices
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for Bergen bar enthusiasts!
