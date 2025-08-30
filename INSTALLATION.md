# Green Hydrogen Ecosystem Platform - Installation Guide

## Prerequisites

Before setting up the Green Hydrogen Ecosystem Platform, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- A **Supabase** account (free tier available)

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repository-url>
cd green-hydrogen-ecosystem-platform

# Install dependencies
npm install
```

### 2. Supabase Setup

#### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Wait for the project to be fully initialized

#### 2.2 Get Your Credentials

1. Go to Settings → API in your Supabase dashboard
2. Copy your Project URL and anon/public key

#### 2.3 Set Up Environment Variables

1. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Database Setup

#### 3.1 Create Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `database/schema.sql`
3. Click "Run" to execute the schema creation

#### 3.2 Add Sample Data (Optional)

1. In the SQL Editor, copy and paste the contents of `database/sample_data.sql`
2. **Important**: Before running, replace the UUID placeholders:
   - Replace `'00000000-0000-0000-0000-000000000001'` with your actual user ID
   - You can find your user ID by:
     - Signing up through the app first, OR
     - Going to Authentication → Users in Supabase dashboard
3. Click "Run" to populate with sample data

### 4. Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Production Deployment

### Environment Setup

Create a production `.env` file with your production Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### Build and Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Options

1. **Vercel** (Recommended)

   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **AWS S3 + CloudFront**
   - Upload `dist/` contents to S3 bucket
   - Configure CloudFront distribution

## Configuration Guide

### Authentication Setup

The platform uses Supabase Auth with the following default settings:

- Email/password authentication
- Role-based access control
- Automatic user session management

To customize authentication:

1. Go to Authentication → Settings in Supabase
2. Configure auth providers, email templates, etc.

### Database Customization

To modify the database schema:

1. Update `database/schema.sql`
2. Run migrations in Supabase SQL Editor
3. Update TypeScript types in `src/types/index.ts`

### Map Configuration

The platform uses Leaflet.js for mapping. To customize:

1. Edit `src/components/Map/MapView.tsx`
2. Change tile layer, default zoom, center point
3. Customize marker styles and colors

## Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Supabase connection issues

- Verify your environment variables are correct
- Check Supabase project is fully initialized
- Ensure RLS policies are properly configured

#### 3. Build errors

```bash
# Check TypeScript errors
npm run lint

# Type check without building
npx tsc --noEmit
```

#### 4. Authentication not working

- Verify Supabase Auth is enabled
- Check email confirmation settings
- Ensure user roles are properly set

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify all environment variables are set
3. Ensure database schema is properly created
4. Check Supabase logs in the dashboard

## Development Features

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Features Implemented

✅ **Interactive Map Dashboard**

- Leaflet.js integration with custom markers
- Asset type filtering and search
- Real-time data updates

✅ **Green Hydrogen Asset Management**

- CRUD operations for all asset types
- Support for hydrogen plants, storage, pipelines, distribution hubs
- Renewable energy source integration

✅ **Advanced Optimization Engine**

- Multi-criteria site selection
- Proximity analysis (renewables, demand, infrastructure)
- Cost estimation and risk assessment
- Environmental impact scoring

✅ **Comprehensive Analytics**

- Supply vs demand analysis
- Regional distribution charts
- Environmental impact metrics
- Investment tracking

✅ **Role-based Access Control**

- Planner, Energy Company, Analyst, Admin roles
- Secure asset creation and modification
- User-specific data access

✅ **Modern UI/UX**

- Responsive design for all devices
- Professional color scheme
- Accessibility features
- Real-time notifications

## Next Steps

To further enhance the platform:

1. **Backend Integration**: Replace mock optimization service with real algorithms
2. **Advanced GIS**: Add support for GeoJSON layers and spatial analysis
3. **Real-time Collaboration**: Implement live updates for multi-user editing
4. **Advanced Analytics**: Add predictive modeling and scenario planning
5. **Mobile App**: Create React Native companion app
6. **API Integration**: Connect with energy market data and regulatory APIs

## Support

For technical support or questions about the Green Hydrogen Ecosystem Platform, please:

- Check the documentation in this repository
- Review the code comments for implementation details
- Refer to the Supabase documentation for database/auth issues