# Expense Tracker Frontend

A modern, responsive expense tracking application built with React, Vite, and Tailwind CSS.

## Features

- User authentication (login/register)
- Dashboard with financial overview
- Transaction management (income and expenses)
- Category management
- Detailed reporting with charts
- Dark mode support
- Responsive design for all devices

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4
- **State Management**: React Context API
- **Routing**: React Router v6
- **Charts**: Recharts
- **UI Components**: Custom component library
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

### Previewing the Production Build

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
src/
├── api/              # API service functions
├── components/       # Reusable UI components
│   ├── common/       # Generic components (Button, Card, etc.)
│   └── layout/       # Layout components (Header, Sidebar)
├── context/          # React context providers
├── pages/            # Page components
├── App.jsx           # Main application component
└── main.jsx          # Application entry point
```

## Development

### Adding New Components

1. Create a new component file in the appropriate directory under `src/components/`
2. Follow the existing component structure and styling patterns
3. Export the component for use in other files

### Adding New Pages

1. Create a new page component in `src/pages/`
2. Add the route in `App.jsx`
3. Import and use the page component

## Environment Variables

The application uses the following environment variables:

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000)

## Proxy Configuration

The development server is configured to proxy API requests to the backend server running on `http://localhost:5000`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.


Frontend :- 
"@tailwindcss/vite": "^4.1.14",
    "axios": "^1.12.2", - connecting frontend and backend
    "date-fns": "^4.1.0", - date
    "lucide-react": "^0.545.0", - icons
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-hook-form": "^7.64.0", - form handling
    "react-hot-toast": "^2.6.0", - for notifications
    "react-router-dom": "^7.9.4", - routing through pages
    "recharts": "^3.2.1", - graph, pie charts
    "tailwindcss": "^4.1.15"

Backend :-
"bcryptjs": "^3.0.2", - hashing password
    "cookie-parser": "^1.4.6", - generate token
    "cors": "^2.8.5", - api handling, connecting backend to frontend
    "dotenv": "^17.2.3", - hides the secret info
    "express": "^5.1.0", - create server
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1", - valid login / register
    "helmet": "^7.1.0", - secure
    "jsonwebtoken": "^9.0.2", - login / register
    "mongoose": "^8.19.1", - connect backend server to database server
    "morgan": "^1.10.0" - logger



Installing:- react
Installing:- tailwindcss
how to initialize backend - npm init -y
how to installing packages - npm install _____