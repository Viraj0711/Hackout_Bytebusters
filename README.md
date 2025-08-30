# Green Hydrogen Ecosystem Platform
*By Team Bytebusters*

An interactive web platform that visualizes and optimizes the green hydrogen ecosystem—including plants, pipelines, storage sites, distribution hubs, and relevant renewable energy resources—on a geographic map. The solution empowers planners, energy companies, and project developers to make informed decisions about site selection and optimize investments using real data and computational modeling.

## 🌟 Key Features

### Interactive Map Dashboard
- Visualize existing and proposed infrastructure assets with custom markers and layers
- Map overlays for renewable sources, transport logistics, and demand centers
- Clickable assets show detailed information (capacity, status, owner, location)
- Real-time geographic visualization with filtering capabilities

### Infrastructure Data Integration
- Connected to Supabase for dynamic asset, location, and user data management
- CRUD capabilities for infrastructure items via secure forms and modal dialogs
- Support for multiple asset types: plants, pipelines, storage, distribution hubs, renewable sources

### Optimization & Recommendation Engine
- Server-side analysis for optimal site selection based on constraints
- Considers distance, regulatory boundaries, cost, and renewable proximity
- Results displayed with highlighted locations and recommendation cards
- Real-time optimization calculations with visual feedback

### Advanced Filtering & Search
- Interactive controls for filtering by asset type, region, operational status
- Instant search for facility names and locations
- Multi-criteria filtering with real-time results

### Data Visualization Widgets
- Chart and statistics components for demand vs. supply analysis
- Cost comparison visualizations
- Network connectivity and capacity analysis
- Interactive analytics dashboard

### Secure Authentication & Roles
- Supabase Auth integration for user management
- Role-based access control (planner, energy company, analyst, admin)
- Secure CRUD operations based on user permissions

## 🚀 Technology Stack

### Frontend
- **React.js** with TypeScript for type-safe development
- **Tailwind CSS** for modern, responsive styling
- **Leaflet.js** for interactive map rendering and GIS data visualization
- **Recharts** for data visualization and analytics
- **Radix UI** components for accessible, themeable interface elements
- **React Hot Toast** for user notifications

### Backend & Database
- **Supabase** for backend-as-a-service with PostgreSQL database
- **Supabase Auth** for user authentication and authorization
- **Real-time subscriptions** for live data updates

### Map & GIS
- **Leaflet.js** for interactive maps with custom markers and overlays
- **React Leaflet** for React integration
- Support for multiple map layers and geographic data visualization

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd green-hydrogen-ecosystem-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Set up your Supabase project
   - Run the provided SQL scripts to create the necessary tables
   - Configure Row Level Security (RLS) policies

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The platform uses the following main tables:

- **assets**: Infrastructure assets (plants, pipelines, storage, etc.)
- **recommendations**: Optimization recommendations and site suggestions
- **users**: User profiles with role-based access control

## 🎯 User Roles & Permissions

- **Planner**: View and analyze infrastructure data, access optimization tools
- **Energy Company**: Full CRUD access to assets, advanced analytics
- **Analyst**: Read-only access with advanced filtering and reporting
- **Admin**: Full platform administration and user management

## 🗺️ Example User Flow

1. **Authentication**: User logs in via Supabase Auth; role determines interface access
2. **Explore Map**: Interactive map loads with asset overlays and filtering options
3. **Add/Edit Infrastructure**: Secure modal forms for facility data with geolocation
4. **Optimization**: Set constraints for site selection; view recommendations on map
5. **Analytics**: Access charts for demand/supply trends and investment analysis
6. **Export**: Download custom asset lists and reports for further analysis

## 🚀 Development

- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Preview**: `npm run preview`

## 📝 License

This project is part of Hackout25 and is intended for educational and demonstration purposes.

---

Built with ❤️ by **Team Bytebusters** for sustainable energy infrastructure planning
