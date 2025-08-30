export interface User {
  id: string;
  email: string;
  role: 'planner' | 'energy_company' | 'analyst' | 'admin';
  created_at: string;
  full_name?: string;
  organization?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'hydrogen_plant' | 'pipeline' | 'storage_facility' | 'distribution_hub' | 'renewable_source' | 'demand_center';
  subtype?: 'electrolysis_plant' | 'compression_station' | 'refueling_station' | 'industrial_user' | 'transportation_hub' | 'solar_farm' | 'wind_farm' | 'underground_storage' | 'above_ground_storage';
  status: 'operational' | 'planned' | 'under_construction' | 'decommissioned' | 'proposed';
  latitude: number;
  longitude: number;
  capacity?: number;
  capacity_unit?: string;
  owner: string;
  description?: string;
  regulatory_zone?: string;
  cost_estimate?: number;
  annual_production?: number; // For hydrogen plants (kg/year)
  storage_pressure?: number; // For storage facilities (bar)
  pipeline_diameter?: number; // For pipelines (inches)
  renewable_capacity?: number; // For renewable sources (MW)
  demand_forecast?: number; // For demand centers (kg/year)
  created_at: string;
  updated_at: string;
  created_by: string;
  environmental_impact_score?: number;
  safety_rating?: 'A' | 'B' | 'C' | 'D';
  connection_points?: string[]; // IDs of connected assets
}

export interface OptimizationConstraints {
  maxDistance: number; // km from renewable sources
  minCapacity: number; // minimum hydrogen production capacity
  maxCost: number; // maximum investment cost
  preferredZones: string[]; // regulatory zones
  renewableProximity: boolean; // prioritize proximity to renewable sources
  environmentalScore: number; // minimum environmental score (1-10)
  safetyRequirements: string[]; // safety standards required
  demandProximity: boolean; // prioritize proximity to demand centers
  existingInfrastructure: boolean; // leverage existing infrastructure
  transportationCost: boolean; // include transportation cost analysis
}

export interface Recommendation {
  id: string;
  type?: string; // Type of recommendation (site_selection, capacity_optimization, route_optimization)
  title?: string; // Title of the recommendation
  description?: string; // Description of the recommendation
  confidence?: number; // Confidence level (0-1)
  potential_savings?: number; // Potential savings in currency
  implementation_timeline?: string; // Timeline for implementation
  justification?: string; // Justification for the recommendation
  requirements?: string[]; // List of requirements
  latitude: number;
  longitude: number;
  score: number;
  reasoning: string;
  estimated_cost: number;
  renewable_proximity: number; // km to nearest renewable source
  demand_proximity: number; // km to nearest demand center
  environmental_impact: number; // 1-10 scale
  regulatory_compliance: boolean;
  infrastructure_synergy: number; // synergy with existing infrastructure
  risk_assessment: 'low' | 'medium' | 'high';
  recommended_capacity: number;
  payback_period: number; // years
  created_at: string;
  created_by: string;
}

export interface FilterState {
  assetTypes: string[];
  subtypes: string[];
  statuses: string[];
  regions: string[];
  search: string;
  capacityRange: [number, number];
  environmentalScore: [number, number];
  safetyRating: string[];
  ownerFilter: string[];
}

export interface DemandData {
  region: string;
  current_demand: number; // kg/year
  projected_demand_2030: number;
  projected_demand_2050: number;
  primary_sectors: string[]; // e.g., 'steel', 'transport', 'chemicals'
}

export interface SupplyData {
  region: string;
  current_production: number; // kg/year
  planned_production: number;
  renewable_potential: number; // MW
  grid_capacity: number; // MW
}

export interface TransportRoute {
  id: string;
  from_asset_id: string;
  to_asset_id: string;
  distance: number; // km
  transport_mode: 'pipeline' | 'truck' | 'ship' | 'rail';
  capacity: number; // kg/day
  cost_per_kg: number;
  environmental_impact: number;
}

export interface AnalyticsData {
  totalAssets: number;
  totalCapacity: number;
  capacityByType: Record<string, number>;
  statusDistribution: Record<string, number>;
  regionalDistribution: Record<string, number>;
  investmentTotal: number;
  investmentByRegion: Record<string, number>;
  supplyDemandGap: Record<string, number>;
  environmentalImpact: number;
  carbonReduction: number; // tons CO2/year
}