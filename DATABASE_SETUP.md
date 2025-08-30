# 🗄️ Database Setup Guide - Green Hydrogen Ecosystem Platform

## 🚀 Quick Setup Instructions

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/Sign in with GitHub or email
4. Click "New Project"
5. Choose your organization
6. Fill in:
   - **Project Name**: `green-hydrogen-platform`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
7. Click "Create new project"

### Step 2: Get Your Credentials
Once your project is created:
1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (something like: `https://abcdefgh.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 3: Update .env File
Replace the placeholder values in your `.env` file:

```properties
# Replace these with your actual Supabase credentials
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

### Step 4: Set Up Database Schema
In your Supabase dashboard:

1. Go to **SQL Editor**
2. Create a new query
3. Paste and run the following SQL:

```sql
-- Enable RLS (Row Level Security)
ALTER TABLE IF EXISTS public.assets ENABLE ROW LEVEL SECURITY;

-- Create assets table
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hydrogen_plant', 'pipeline', 'storage_facility', 'distribution_hub', 'renewable_source', 'demand_center')),
  subtype TEXT,
  status TEXT NOT NULL CHECK (status IN ('operational', 'planned', 'under_construction', 'decommissioned', 'proposed')),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  capacity DECIMAL,
  capacity_unit TEXT,
  owner TEXT NOT NULL,
  description TEXT,
  regulatory_zone TEXT,
  cost_estimate DECIMAL,
  annual_production DECIMAL,
  storage_pressure DECIMAL,
  pipeline_diameter DECIMAL,
  renewable_capacity DECIMAL,
  demand_forecast DECIMAL,
  environmental_impact_score DECIMAL CHECK (environmental_impact_score >= 0 AND environmental_impact_score <= 100),
  safety_rating TEXT CHECK (safety_rating IN ('A', 'B', 'C', 'D')),
  connection_points TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  score DECIMAL NOT NULL CHECK (score >= 0 AND score <= 100),
  reasoning TEXT NOT NULL,
  estimated_cost DECIMAL NOT NULL,
  renewable_proximity DECIMAL CHECK (renewable_proximity >= 0 AND renewable_proximity <= 100),
  demand_proximity DECIMAL CHECK (demand_proximity >= 0 AND demand_proximity <= 100),
  environmental_impact DECIMAL CHECK (environmental_impact >= 0 AND environmental_impact <= 100),
  regulatory_compliance BOOLEAN NOT NULL,
  infrastructure_synergy DECIMAL CHECK (infrastructure_synergy >= 0 AND infrastructure_synergy <= 100),
  risk_assessment TEXT NOT NULL CHECK (risk_assessment IN ('low', 'medium', 'high')),
  recommended_capacity DECIMAL NOT NULL,
  payback_period DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create transport_routes table
CREATE TABLE IF NOT EXISTS public.transport_routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_asset_id UUID REFERENCES public.assets(id),
  to_asset_id UUID REFERENCES public.assets(id),
  distance DECIMAL NOT NULL,
  transport_mode TEXT NOT NULL CHECK (transport_mode IN ('pipeline', 'truck', 'ship', 'rail')),
  capacity DECIMAL NOT NULL,
  cost_per_kg DECIMAL NOT NULL,
  environmental_impact DECIMAL CHECK (environmental_impact >= 0 AND environmental_impact <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create demand_data table
CREATE TABLE IF NOT EXISTS public.demand_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT NOT NULL,
  current_demand DECIMAL NOT NULL,
  projected_demand_2030 DECIMAL NOT NULL,
  projected_demand_2050 DECIMAL NOT NULL,
  primary_sectors TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supply_data table
CREATE TABLE IF NOT EXISTS public.supply_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT NOT NULL,
  current_production DECIMAL NOT NULL,
  planned_production DECIMAL NOT NULL,
  renewable_potential DECIMAL NOT NULL,
  grid_capacity DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
CREATE POLICY "Users can view all assets" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Users can insert assets" ON public.assets FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own assets" ON public.assets FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own assets" ON public.assets FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Users can view all recommendations" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Users can insert recommendations" ON public.recommendations FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER handle_assets_updated_at BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_demand_data_updated_at BEFORE UPDATE ON public.demand_data
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_supply_data_updated_at BEFORE UPDATE ON public.supply_data
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

### Step 5: Insert Sample Data (Optional)
To populate your database with sample data for testing:

```sql
-- Insert sample assets
INSERT INTO public.assets (name, type, status, latitude, longitude, capacity, capacity_unit, owner, description, regulatory_zone, created_by) VALUES
('Green Valley H2 Plant', 'hydrogen_plant', 'operational', 26.9124, 75.7873, 100, 'MW', 'Green Energy Corp', 'Large-scale green hydrogen production facility', 'Rajasthan', auth.uid()),
('Rajasthan Solar Farm', 'renewable_source', 'operational', 27.0238, 74.2179, 500, 'MW', 'Solar Power Ltd', 'Major solar installation for renewable energy', 'Rajasthan', auth.uid()),
('Gujarat Storage Hub', 'storage_facility', 'under_construction', 23.0225, 72.5714, 1000, 'kg/day', 'Infrastructure Co', 'High-pressure hydrogen storage facility', 'Gujarat', auth.uid()),
('Delhi Distribution Center', 'distribution_hub', 'planned', 28.7041, 77.1025, 200, 'kg/day', 'Metro Gas Ltd', 'Urban hydrogen distribution network', 'Delhi', auth.uid()),
('Mumbai Demand Center', 'demand_center', 'operational', 19.0760, 72.8777, 150, 'kg/day', 'Industrial Corp', 'Industrial hydrogen consumption hub', 'Maharashtra', auth.uid());

-- Insert sample demand data
INSERT INTO public.demand_data (region, current_demand, projected_demand_2030, projected_demand_2050, primary_sectors) VALUES
('Rajasthan', 50.5, 120.0, 300.0, ARRAY['Steel', 'Fertilizer', 'Refining']),
('Gujarat', 75.2, 180.0, 450.0, ARRAY['Petrochemicals', 'Fertilizer', 'Steel']),
('Maharashtra', 85.8, 200.0, 500.0, ARRAY['Steel', 'Chemicals', 'Transport']),
('Tamil Nadu', 45.3, 110.0, 280.0, ARRAY['Refining', 'Fertilizer', 'Electronics']);

-- Insert sample supply data
INSERT INTO public.supply_data (region, current_production, planned_production, renewable_potential, grid_capacity) VALUES
('Rajasthan', 25.0, 150.0, 500.0, 800.0),
('Gujarat', 40.0, 200.0, 400.0, 750.0),
('Maharashtra', 35.0, 180.0, 300.0, 900.0),
('Tamil Nadu', 30.0, 160.0, 350.0, 700.0);
```

## 🔧 Authentication Setup

### Enable Email Authentication
1. In Supabase Dashboard → **Authentication** → **Settings**
2. Enable **Email** provider
3. Configure email templates if needed

### Email Configuration (Optional)
For production, configure SMTP:
1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Add your email service credentials

## 🌐 Testing Connection

1. **Restart your development server** after updating `.env`
2. **Open the application** in your browser
3. **Try to sign up** with a test email
4. **Check Supabase Dashboard** → **Authentication** → **Users** to see registered users
5. **Add some assets** through the UI to test database operations

## 🔍 Troubleshooting

### Common Issues:

**1. "Failed to fetch" errors:**
- Check if your Supabase URL is correct
- Verify the anon key is properly copied
- Ensure no extra spaces in `.env` file

**2. "Invalid JWT" errors:**
- Copy the anon key again from Supabase dashboard
- Make sure you're using the anon key, not the service role key

**3. "Permission denied" errors:**
- Check if RLS policies are set up correctly
- Verify user is authenticated before making requests

**4. Database connection fails:**
- Ensure your Supabase project is active
- Check if you're within the free tier limits

## 📊 Verify Setup

✅ **Checklist:**
- [ ] Supabase project created
- [ ] Environment variables updated
- [ ] Database schema created
- [ ] Sample data inserted (optional)
- [ ] Authentication working
- [ ] Assets can be created/viewed
- [ ] Analytics page shows data

## 🎯 Next Steps

Once your database is connected:
1. **Test user registration** and login
2. **Create sample assets** through the UI
3. **Verify analytics** are populated with real data
4. **Test optimization** features
5. **Add real infrastructure** data for your region

---

🚀 **Ready to power your Green Hydrogen Ecosystem Platform with real data!**