-- Green Hydrogen Ecosystem Platform Database Schema
-- Run these SQL commands in your Supabase SQL editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.demand_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.supply_data ENABLE ROW LEVEL SECURITY;

-- Create custom types
CREATE TYPE asset_type AS ENUM (
  'hydrogen_plant',
  'pipeline', 
  'storage_facility',
  'distribution_hub',
  'renewable_source',
  'demand_center'
);

CREATE TYPE asset_status AS ENUM (
  'operational',
  'planned',
  'under_construction',
  'decommissioned',
  'proposed'
);

CREATE TYPE safety_rating AS ENUM ('A', 'B', 'C', 'D');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE transport_mode AS ENUM ('pipeline', 'truck', 'ship', 'rail');

-- Assets table for green hydrogen infrastructure
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type asset_type NOT NULL,
  subtype VARCHAR(100),
  status asset_status NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  capacity DECIMAL(15, 2),
  capacity_unit VARCHAR(20),
  owner VARCHAR(255) NOT NULL,
  description TEXT,
  regulatory_zone VARCHAR(100),
  cost_estimate DECIMAL(15, 2),
  annual_production DECIMAL(15, 2), -- kg/year for hydrogen plants
  storage_pressure DECIMAL(10, 2), -- bar for storage facilities
  pipeline_diameter DECIMAL(10, 2), -- inches for pipelines
  renewable_capacity DECIMAL(15, 2), -- MW for renewable sources
  demand_forecast DECIMAL(15, 2), -- kg/year for demand centers
  environmental_impact_score DECIMAL(3, 1) CHECK (environmental_impact_score >= 1 AND environmental_impact_score <= 10),
  safety_rating safety_rating,
  connection_points TEXT[], -- Array of connected asset IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Recommendations table for optimization results
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  score DECIMAL(5, 2) NOT NULL CHECK (score >= 0 AND score <= 100),
  reasoning TEXT NOT NULL,
  estimated_cost DECIMAL(15, 2) NOT NULL,
  renewable_proximity DECIMAL(10, 2) NOT NULL, -- km
  demand_proximity DECIMAL(10, 2) NOT NULL, -- km
  environmental_impact DECIMAL(3, 1) CHECK (environmental_impact >= 1 AND environmental_impact <= 10),
  regulatory_compliance BOOLEAN DEFAULT true,
  infrastructure_synergy DECIMAL(5, 2) DEFAULT 0,
  risk_assessment risk_level NOT NULL,
  recommended_capacity DECIMAL(15, 2) NOT NULL,
  payback_period DECIMAL(5, 1) NOT NULL, -- years
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Transport routes table for logistics optimization
CREATE TABLE IF NOT EXISTS public.transport_routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
  to_asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
  distance DECIMAL(10, 2) NOT NULL, -- km
  transport_mode transport_mode NOT NULL,
  capacity DECIMAL(15, 2) NOT NULL, -- kg/day
  cost_per_kg DECIMAL(10, 4) NOT NULL,
  environmental_impact DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Demand data table for market analysis
CREATE TABLE IF NOT EXISTS public.demand_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region VARCHAR(100) NOT NULL,
  current_demand DECIMAL(15, 2) NOT NULL, -- kg/year
  projected_demand_2030 DECIMAL(15, 2) NOT NULL,
  projected_demand_2050 DECIMAL(15, 2) NOT NULL,
  primary_sectors TEXT[] NOT NULL, -- e.g., ['steel', 'transport', 'chemicals']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supply data table for capacity analysis
CREATE TABLE IF NOT EXISTS public.supply_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region VARCHAR(100) NOT NULL,
  current_production DECIMAL(15, 2) NOT NULL, -- kg/year
  planned_production DECIMAL(15, 2) NOT NULL,
  renewable_potential DECIMAL(15, 2) NOT NULL, -- MW
  grid_capacity DECIMAL(15, 2) NOT NULL, -- MW
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assets_type ON public.assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_location ON public.assets(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_assets_regulatory_zone ON public.assets(regulatory_zone);
CREATE INDEX IF NOT EXISTS idx_assets_created_by ON public.assets(created_by);
CREATE INDEX IF NOT EXISTS idx_recommendations_score ON public.recommendations(score DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_created_by ON public.recommendations(created_by);
CREATE INDEX IF NOT EXISTS idx_transport_routes_assets ON public.transport_routes(from_asset_id, to_asset_id);
CREATE INDEX IF NOT EXISTS idx_demand_data_region ON public.demand_data(region);
CREATE INDEX IF NOT EXISTS idx_supply_data_region ON public.supply_data(region);

-- Row Level Security Policies

-- Assets policies
CREATE POLICY "Users can view all assets" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Users can insert assets" ON public.assets FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own assets" ON public.assets FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own assets" ON public.assets FOR DELETE USING (auth.uid() = created_by);

-- Recommendations policies
CREATE POLICY "Users can view all recommendations" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Users can insert recommendations" ON public.recommendations FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own recommendations" ON public.recommendations FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own recommendations" ON public.recommendations FOR DELETE USING (auth.uid() = created_by);

-- Transport routes policies
CREATE POLICY "Users can view all transport routes" ON public.transport_routes FOR SELECT USING (true);
CREATE POLICY "Users can insert transport routes" ON public.transport_routes FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own transport routes" ON public.transport_routes FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own transport routes" ON public.transport_routes FOR DELETE USING (auth.uid() = created_by);

-- Demand data policies (public read access)
CREATE POLICY "Anyone can view demand data" ON public.demand_data FOR SELECT USING (true);

-- Supply data policies (public read access)
CREATE POLICY "Anyone can view supply data" ON public.supply_data FOR SELECT USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demand_data_updated_at BEFORE UPDATE ON public.demand_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supply_data_updated_at BEFORE UPDATE ON public.supply_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();