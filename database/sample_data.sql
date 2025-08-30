-- Sample data for Green Hydrogen Ecosystem Platform
-- Run this after creating the schema
-- Note: Replace the created_by UUIDs with actual user IDs from your auth.users table

-- Sample demand data by region
INSERT INTO public.demand_data (region, current_demand, projected_demand_2030, projected_demand_2050, primary_sectors) VALUES
('California', 50000, 250000, 1000000, ARRAY['transportation', 'steel', 'chemicals']),
('Texas', 75000, 350000, 1200000, ARRAY['refining', 'chemicals', 'steel']),
('Germany', 120000, 500000, 2000000, ARRAY['steel', 'chemicals', 'transportation', 'heating']),
('Japan', 200000, 800000, 3000000, ARRAY['steel', 'chemicals', 'power_generation']),
('Netherlands', 80000, 300000, 800000, ARRAY['chemicals', 'refining', 'steel']),
('South Korea', 150000, 600000, 2500000, ARRAY['steel', 'shipbuilding', 'chemicals']),
('Australia', 30000, 150000, 600000, ARRAY['mining', 'transportation', 'export']),
('Norway', 25000, 100000, 400000, ARRAY['shipping', 'steel', 'export']);

-- Sample supply data by region
INSERT INTO public.supply_data (region, current_production, planned_production, renewable_potential, grid_capacity) VALUES
('California', 20000, 150000, 25000, 15000),
('Texas', 30000, 200000, 40000, 25000),
('Germany', 50000, 300000, 35000, 20000),
('Japan', 80000, 400000, 15000, 12000),
('Netherlands', 35000, 180000, 20000, 18000),
('South Korea', 60000, 350000, 18000, 15000),
('Australia', 15000, 120000, 80000, 35000),
('Norway', 12000, 80000, 60000, 30000);

-- Sample hydrogen plants
INSERT INTO public.assets (name, type, subtype, status, latitude, longitude, capacity, capacity_unit, owner, description, regulatory_zone, cost_estimate, annual_production, environmental_impact_score, safety_rating, created_by) VALUES
('Green Valley Electrolysis Plant', 'hydrogen_plant', 'electrolysis_plant', 'operational', 34.0522, -118.2437, 100, 'MW', 'Green Energy Corp', 'Large-scale electrolysis facility powered by renewable energy', 'California-South', 250, 5000000, 8.5, 'A', '00000000-0000-0000-0000-000000000001'),
('Texas Hydrogen Hub', 'hydrogen_plant', 'electrolysis_plant', 'under_construction', 29.7604, -95.3698, 200, 'MW', 'Hydrogen Texas LLC', 'Mega-scale hydrogen production facility', 'Texas-Gulf', 500, 10000000, 7.8, 'A', '00000000-0000-0000-0000-000000000001'),
('North Sea Wind-H2 Plant', 'hydrogen_plant', 'electrolysis_plant', 'planned', 53.5511, 9.9937, 150, 'MW', 'European H2 Alliance', 'Offshore wind-powered hydrogen plant', 'Germany-North', 400, 7500000, 9.2, 'A', '00000000-0000-0000-0000-000000000001'),
('Osaka Bay Hydrogen Plant', 'hydrogen_plant', 'electrolysis_plant', 'operational', 34.6937, 135.5023, 80, 'MW', 'Nippon Hydrogen Co', 'Industrial hydrogen production facility', 'Japan-Kansai', 200, 4000000, 7.5, 'B', '00000000-0000-0000-0000-000000000001');

-- Sample renewable energy sources
INSERT INTO public.assets (name, type, subtype, status, latitude, longitude, renewable_capacity, capacity_unit, owner, description, regulatory_zone, cost_estimate, environmental_impact_score, safety_rating, created_by) VALUES
('Mojave Solar Farm', 'renewable_source', 'solar_farm', 'operational', 35.0167, -117.3500, 280, 'MW', 'Solar Power Inc', 'Large-scale solar photovoltaic installation', 'California-South', 400, 9.5, 'A', '00000000-0000-0000-0000-000000000001'),
('West Texas Wind Farm', 'renewable_source', 'wind_farm', 'operational', 32.0000, -102.0000, 300, 'MW', 'Wind Energy LLC', 'High-capacity wind turbine installation', 'Texas-West', 350, 9.0, 'A', '00000000-0000-0000-0000-000000000001'),
('North Sea Wind Park', 'renewable_source', 'wind_farm', 'operational', 54.5000, 6.0000, 500, 'MW', 'Offshore Wind GmbH', 'Large offshore wind installation', 'Germany-North', 800, 9.8, 'A', '00000000-0000-0000-0000-000000000001'),
('Fukushima Floating Solar', 'renewable_source', 'solar_farm', 'operational', 37.4167, 140.9167, 150, 'MW', 'Japan Solar Corp', 'Floating solar installation', 'Japan-Tohoku', 250, 8.8, 'A', '00000000-0000-0000-0000-000000000001');

-- Sample storage facilities
INSERT INTO public.assets (name, type, subtype, status, latitude, longitude, capacity, capacity_unit, owner, description, regulatory_zone, cost_estimate, storage_pressure, environmental_impact_score, safety_rating, created_by) VALUES
('Central Valley Storage', 'storage_facility', 'underground_storage', 'operational', 36.7783, -119.4179, 10000, 'kg', 'Storage Solutions Inc', 'Underground hydrogen storage facility', 'California-Central', 150, 350, 8.0, 'A', '00000000-0000-0000-0000-000000000001'),
('Houston Storage Hub', 'storage_facility', 'above_ground_storage', 'planned', 29.7633, -95.3633, 15000, 'kg', 'Texas Storage Corp', 'High-pressure hydrogen storage tanks', 'Texas-Gulf', 200, 700, 7.5, 'B', '00000000-0000-0000-0000-000000000001'),
('Bremen Storage Facility', 'storage_facility', 'underground_storage', 'under_construction', 53.0792, 8.8017, 8000, 'kg', 'German Storage AG', 'Salt cavern hydrogen storage', 'Germany-North', 180, 300, 8.5, 'A', '00000000-0000-0000-0000-000000000001');

-- Sample pipelines
INSERT INTO public.assets (name, type, status, latitude, longitude, pipeline_diameter, capacity_unit, owner, description, regulatory_zone, cost_estimate, environmental_impact_score, safety_rating, created_by) VALUES
('California H2 Pipeline', 'pipeline', 'planned', 35.0000, -118.0000, 24, 'inches', 'Pipeline Corp', 'Dedicated hydrogen pipeline network', 'California-Central', 800, 7.0, 'A', '00000000-0000-0000-0000-000000000001'),
('Gulf Coast H2 Corridor', 'pipeline', 'under_construction', 29.5000, -95.0000, 36, 'inches', 'Energy Transport LLC', 'High-capacity hydrogen transmission pipeline', 'Texas-Gulf', 1200, 6.8, 'A', '00000000-0000-0000-0000-000000000001'),
('European H2 Backbone', 'pipeline', 'planned', 52.0000, 8.0000, 48, 'inches', 'European Pipeline Consortium', 'Trans-European hydrogen pipeline network', 'Germany-Central', 2000, 7.2, 'A', '00000000-0000-0000-0000-000000000001');

-- Sample distribution hubs
INSERT INTO public.assets (name, type, subtype, status, latitude, longitude, capacity, capacity_unit, owner, description, regulatory_zone, cost_estimate, environmental_impact_score, safety_rating, created_by) VALUES
('LA Hydrogen Hub', 'distribution_hub', 'refueling_station', 'operational', 34.0522, -118.2437, 1000, 'kg/day', 'Fuel Cell Energy', 'Multi-modal hydrogen distribution center', 'California-South', 50, 8.2, 'A', '00000000-0000-0000-0000-000000000001'),
('Port of Hamburg H2 Terminal', 'distribution_hub', 'transportation_hub', 'planned', 53.5511, 9.9937, 5000, 'kg/day', 'Hamburg Port Authority', 'Hydrogen import/export terminal', 'Germany-North', 300, 7.8, 'A', '00000000-0000-0000-0000-000000000001'),
('Tokyo Fuel Cell Station', 'distribution_hub', 'refueling_station', 'operational', 35.6762, 139.6503, 2000, 'kg/day', 'Tokyo Gas Co', 'Urban hydrogen refueling network', 'Japan-Kanto', 75, 7.5, 'B', '00000000-0000-0000-0000-000000000001');

-- Sample demand centers
INSERT INTO public.assets (name, type, subtype, status, latitude, longitude, demand_forecast, capacity_unit, owner, description, regulatory_zone, environmental_impact_score, created_by) VALUES
('Port of Long Beach', 'demand_center', 'transportation_hub', 'operational', 33.7701, -118.1937, 2000000, 'kg/year', 'Port Authority', 'Major shipping and logistics hub', 'California-South', 6.5, '00000000-0000-0000-0000-000000000001'),
('ThyssenKrupp Steel Plant', 'demand_center', 'industrial_user', 'operational', 51.4556, 6.7528, 5000000, 'kg/year', 'ThyssenKrupp AG', 'Steel production facility transitioning to hydrogen', 'Germany-West', 8.0, '00000000-0000-0000-0000-000000000001'),
('Kawasaki Heavy Industries', 'demand_center', 'industrial_user', 'operational', 34.6901, 135.1956, 3000000, 'kg/year', 'Kawasaki Heavy Industries', 'Heavy machinery and shipbuilding', 'Japan-Kansai', 7.2, '00000000-0000-0000-0000-000000000001'),
('BASF Ludwigshafen', 'demand_center', 'industrial_user', 'planned', 49.4875, 8.4660, 4000000, 'kg/year', 'BASF SE', 'Chemical production complex', 'Germany-South', 7.8, '00000000-0000-0000-0000-000000000001');

-- Sample transport routes
INSERT INTO public.transport_routes (from_asset_id, to_asset_id, distance, transport_mode, capacity, cost_per_kg, environmental_impact, created_by) VALUES
((SELECT id FROM public.assets WHERE name = 'Green Valley Electrolysis Plant'), (SELECT id FROM public.assets WHERE name = 'Central Valley Storage'), 150.5, 'pipeline', 50000, 0.15, 2.5, '00000000-0000-0000-0000-000000000001'),
((SELECT id FROM public.assets WHERE name = 'Central Valley Storage'), (SELECT id FROM public.assets WHERE name = 'LA Hydrogen Hub'), 75.2, 'truck', 10000, 0.50, 4.2, '00000000-0000-0000-0000-000000000001'),
((SELECT id FROM public.assets WHERE name = 'Texas Hydrogen Hub'), (SELECT id FROM public.assets WHERE name = 'Houston Storage Hub'), 25.0, 'pipeline', 100000, 0.12, 2.0, '00000000-0000-0000-0000-000000000001');