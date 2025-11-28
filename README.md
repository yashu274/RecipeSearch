# Recipe Sharing & Meal Planning App

A full-stack web application for sharing recipes and planning weekly meals, built with **React**, **Express**, and **SQLite**.

## Features

✨ **Modern UI Design** - Beautiful dark theme with glassmorphism effects and smooth animations  
🔐 **User Authentication** - Secure signup/login with JWT tokens  
📝 **Recipe Management** - Create, edit, delete, and share recipes  
🔍 **Search & Filter** - Find recipes by keywords and categories  
❤️ **Favorites** - Save your favorite recipes  
📅 **Weekly Meal Planner** - Plan meals across the week  
👤 **User Profiles** - View your recipes and favorites

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vanilla CSS** - Modern styling with custom properties

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **SQLite** - Database (better-sqlite3)
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS** - Cross-origin resource sharing

## Project Structure

```
ProU2/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── database.js          # SQLite schema & initialization
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication endpoints
│   │   │   ├── recipes.js           # Recipe CRUD operations
│   │   │   └── meals.js             # Meal planning endpoints
│   │   ├── middleware/
│   │   │   └── authMiddleware.js    # JWT verification
│   │   └── server.js                # Express server setup
│   ├── database/
│   │   └── recipes.db               # SQLite database file
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Navigation bar
    │   │   └── RecipeCard.jsx      # Recipe preview card
    │   ├── pages/
    │   │   ├── Login.jsx           # Authentication page
    │   │   ├── Home.jsx            # Recipe listing & hero
    │   │   ├── RecipeDetail.jsx   # Full recipe view
    │   │   ├── CreateRecipe.jsx   # Recipe creation form
    │   │   ├── Profile.jsx         # User profile
    │   │   └── MealPlan.jsx        # Weekly meal calendar
    │   ├── services/
    │   │   └── api.js              # API client
    │   ├── index.css               # Design system & globals
    │   └── App.jsx                 # Main app component
    └── package.json
```

## Setup & Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The API server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. **Start Backend**: Open a terminal and run `cd backend && npm start`
2. **Start Frontend**: Open another terminal and run `cd frontend && npm run dev`
3. **Open Browser**: Navigate to `http://localhost:5173`
4. **Create Account**: Click "Sign In" and create a new account
5. **Explore**: Browse recipes, create your own, and plan your meals!

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login and get JWT token

### Recipes
- `GET /api/recipes` - Get all recipes (supports search & category filters)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create new recipe (authenticated)
- `PUT /api/recipes/:id` - Update recipe (authenticated, owner only)
- `DELETE /api/recipes/:id` - Delete recipe (authenticated, owner only)
- `POST /api/recipes/:id/favorite` - Toggle favorite (authenticated)
- `GET /api/recipes/user/favorites` - Get user's favorites (authenticated)

### Meal Plans
- `GET /api/meals` - Get meal plan (authenticated)
- `POST /api/meals` - Add recipe to meal plan (authenticated)
- `DELETE /api/meals/:id` - Remove from meal plan (authenticated)

## Database Schema

### Users
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password_hash` - Hashed password
- `created_at` - Timestamp

### Recipes
- `id` - Primary key
- `user_id` - Foreign key to users
- `title` - Recipe title
- `description` - Recipe description
- `ingredients` - JSON array of ingredients
- `instructions` - JSON array of steps
- `prep_time` - Preparation time (minutes)
- `cook_time` - Cooking time (minutes)
- `servings` - Number of servings
- `image_url` - Recipe image URL
- `category` - Recipe category
- `created_at` - Timestamp

### Meal Plans
- `id` - Primary key
- `user_id` - Foreign key to users
- `recipe_id` - Foreign key to recipes
- `planned_date` - Date for the meal
- `meal_type` - breakfast/lunch/dinner

### Favorites
- `user_id` - Foreign key to users
- `recipe_id` - Foreign key to recipes
- Composite primary key

## Design Features

- **Modern Dark Theme** - Easy on the eyes with HSL color system
- **Glassmorphism** - Frosted glass effects on cards and modals
- **Gradient Accents** - Vibrant orange-to-purple gradients
- **Smooth Animations** - Hover effects and transitions
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Custom Scrollbars** - Styled scrollbars matching the theme
- **Typography** - Inter font family for clean readability


## Screenshots
<img width="1440" height="809" alt="Screenshot 2025-11-28 at 7 34 50 PM" src="https://github.com/user-attachments/assets/7ac72ded-9c90-4c88-9aab-8aa795d9243b" />
<img width="1440" height="809" alt="Screenshot 2025-11-28 at 7 35 02 PM" src="https://github.com/user-attachments/assets/9a75a47f-eb19-4133-8a98-80243a485bee" />
<img width="1440" height="809" alt="Screenshot 2025-11-28 at 7 35 19 PM" src="https://github.com/user-attachments/assets/2ed2e077-c063-4c67-b49d-7ded47da492f" />
<img width="1440" height="809" alt="Screenshot 2025-11-28 at 7 35 33 PM" src="https://github.com/user-attachments/assets/b17435f0-1092-461e-8777-7c21fe0848d4" />
<img width="1440" height="809" alt="Screenshot 2025-11-28 at 7 35 58 PM" src="https://github.com/user-attachments/assets/c8e2c6ca-29ce-4683-9c9d-ec4c0110dea4" />
<img width="1440" height="809" alt="Screenshot 2025-11-28 at 7 36 12 PM" src="https://github.com/user-attachments/assets/7548406c-8af3-4c0d-b292-0efb991de81f" />
<img width="1440" height="809" alt="Screenshot 2025-11-28 at 7 36 19 PM" src="https://github.com/user-attachments/assets/5eff44fc-23d5-4ed2-a075-1af9e146c506" />


## License

MIT

## Author
@yashu274
