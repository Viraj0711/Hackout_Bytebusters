import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string;
          name: string;
          type: 'hydrogen_plant' | 'pipeline' | 'storage_facility' | 'distribution_hub' | 'renewable_source' | 'demand_center';
          subtype: string | null;
          status: 'operational' | 'planned' | 'under_construction' | 'decommissioned' | 'proposed';
          latitude: number;
          longitude: number;
          capacity: number | null;
          capacity_unit: string | null;
          owner: string;
          description: string | null;
          regulatory_zone: string | null;
          cost_estimate: number | null;
          annual_production: number | null;
          storage_pressure: number | null;
          pipeline_diameter: number | null;
          renewable_capacity: number | null;
          demand_forecast: number | null;
          environmental_impact_score: number | null;
          safety_rating: 'A' | 'B' | 'C' | 'D' | null;
          connection_points: string[] | null;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: 'hydrogen_plant' | 'pipeline' | 'storage_facility' | 'distribution_hub' | 'renewable_source' | 'demand_center';
          subtype?: string | null;
          status: 'operational' | 'planned' | 'under_construction' | 'decommissioned' | 'proposed';
          latitude: number;
          longitude: number;
          capacity?: number | null;
          capacity_unit?: string | null;
          owner: string;
          description?: string | null;
          regulatory_zone?: string | null;
          cost_estimate?: number | null;
          annual_production?: number | null;
          storage_pressure?: number | null;
          pipeline_diameter?: number | null;
          renewable_capacity?: number | null;
          demand_forecast?: number | null;
          environmental_impact_score?: number | null;
          safety_rating?: 'A' | 'B' | 'C' | 'D' | null;
          connection_points?: string[] | null;
          created_by: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'hydrogen_plant' | 'pipeline' | 'storage_facility' | 'distribution_hub' | 'renewable_source' | 'demand_center';
          subtype?: string | null;
          status?: 'operational' | 'planned' | 'under_construction' | 'decommissioned' | 'proposed';
          latitude?: number;
          longitude?: number;
          capacity?: number | null;
          capacity_unit?: string | null;
          owner?: string;
          description?: string | null;
          regulatory_zone?: string | null;
          cost_estimate?: number | null;
          annual_production?: number | null;
          storage_pressure?: number | null;
          pipeline_diameter?: number | null;
          renewable_capacity?: number | null;
          demand_forecast?: number | null;
          environmental_impact_score?: number | null;
          safety_rating?: 'A' | 'B' | 'C' | 'D' | null;
          connection_points?: string[] | null;
          updated_at?: string;
        };
      };
      recommendations: {
        Row: {
          id: string;
          latitude: number;
          longitude: number;
          score: number;
          reasoning: string;
          estimated_cost: number;
          renewable_proximity: number;
          demand_proximity: number;
          environmental_impact: number;
          regulatory_compliance: boolean;
          infrastructure_synergy: number;
          risk_assessment: 'low' | 'medium' | 'high';
          recommended_capacity: number;
          payback_period: number;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          latitude: number;
          longitude: number;
          score: number;
          reasoning: string;
          estimated_cost: number;
          renewable_proximity: number;
          demand_proximity: number;
          environmental_impact: number;
          regulatory_compliance: boolean;
          infrastructure_synergy: number;
          risk_assessment: 'low' | 'medium' | 'high';
          recommended_capacity: number;
          payback_period: number;
          created_by: string;
        };
        Update: {
          id?: string;
          latitude?: number;
          longitude?: number;
          score?: number;
          reasoning?: string;
          estimated_cost?: number;
          renewable_proximity?: number;
          demand_proximity?: number;
          environmental_impact?: number;
          regulatory_compliance?: boolean;
          infrastructure_synergy?: number;
          risk_assessment?: 'low' | 'medium' | 'high';
          recommended_capacity?: number;
          payback_period?: number;
        };
      };
      transport_routes: {
        Row: {
          id: string;
          from_asset_id: string;
          to_asset_id: string;
          distance: number;
          transport_mode: 'pipeline' | 'truck' | 'ship' | 'rail';
          capacity: number;
          cost_per_kg: number;
          environmental_impact: number;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          from_asset_id: string;
          to_asset_id: string;
          distance: number;
          transport_mode: 'pipeline' | 'truck' | 'ship' | 'rail';
          capacity: number;
          cost_per_kg: number;
          environmental_impact: number;
          created_by: string;
        };
        Update: {
          id?: string;
          from_asset_id?: string;
          to_asset_id?: string;
          distance?: number;
          transport_mode?: 'pipeline' | 'truck' | 'ship' | 'rail';
          capacity?: number;
          cost_per_kg?: number;
          environmental_impact?: number;
        };
      };
      demand_data: {
        Row: {
          id: string;
          region: string;
          current_demand: number;
          projected_demand_2030: number;
          projected_demand_2050: number;
          primary_sectors: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          region: string;
          current_demand: number;
          projected_demand_2030: number;
          projected_demand_2050: number;
          primary_sectors: string[];
        };
        Update: {
          id?: string;
          region?: string;
          current_demand?: number;
          projected_demand_2030?: number;
          projected_demand_2050?: number;
          primary_sectors?: string[];
          updated_at?: string;
        };
      };
      supply_data: {
        Row: {
          id: string;
          region: string;
          current_production: number;
          planned_production: number;
          renewable_potential: number;
          grid_capacity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          region: string;
          current_production: number;
          planned_production: number;
          renewable_potential: number;
          grid_capacity: number;
        };
        Update: {
          id?: string;
          region?: string;
          current_production?: number;
          planned_production?: number;
          renewable_potential?: number;
          grid_capacity?: number;
          updated_at?: string;
        };
      };
    };
  };
};