import { Asset } from '../types';

export interface AnalyticsData {
  totalAssets: number;
  totalCapacity: number;
  totalProduction: number;
  totalDemand: number;
  carbonReduction: number;
  averageEfficiency: number;
  regionDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  monthlyTrends: MonthlyTrend[];
  performanceMetrics: PerformanceMetric[];
}

export interface MonthlyTrend {
  month: string;
  production: number;
  efficiency: number;
  capacity: number;
  demand: number;
}

export interface PerformanceMetric {
  region: string;
  assets: number;
  production: number;
  efficiency: number;
  status: 'optimal' | 'good' | 'needs-improvement';
}

export interface KPICard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export class AnalyticsService {
  static calculateAnalytics(assets: Asset[]): AnalyticsData {
    const totalAssets = assets.length;
    
    const totalCapacity = assets.reduce((sum, asset) => {
      return sum + (asset.capacity || 0);
    }, 0);

    const totalProduction = assets.reduce((sum, asset) => {
      return sum + (asset.annual_production || 0);
    }, 0);

    const totalDemand = assets.reduce((sum, asset) => {
      return sum + (asset.demand_forecast || 0);
    }, 0);

    const carbonReduction = this.calculateCarbonReduction(assets);
    const averageEfficiency = this.calculateAverageEfficiency(assets);
    
    const regionDistribution = this.calculateRegionDistribution(assets);
    const typeDistribution = this.calculateTypeDistribution(assets);
    const statusDistribution = this.calculateStatusDistribution(assets);
    
    const monthlyTrends = this.generateMonthlyTrends();
    const performanceMetrics = this.calculatePerformanceMetrics(assets);

    return {
      totalAssets,
      totalCapacity,
      totalProduction,
      totalDemand,
      carbonReduction,
      averageEfficiency,
      regionDistribution,
      typeDistribution,
      statusDistribution,
      monthlyTrends,
      performanceMetrics
    };
  }

  static calculateCarbonReduction(assets: Asset[]): number {
    // Estimate carbon reduction based on hydrogen production
    // 1 kg H2 ≈ 11 kg CO2 reduction compared to fossil fuels
    const totalProduction = assets.reduce((sum, asset) => {
      return sum + (asset.annual_production || 0);
    }, 0);
    
    return totalProduction * 11; // kg CO2 reduction per year
  }

  static calculateAverageEfficiency(assets: Asset[]): number {
    const productionAssets = assets.filter(asset => 
      asset.type === 'hydrogen_plant' && asset.status === 'operational'
    );
    
    if (productionAssets.length === 0) return 0;
    
    // Simulate efficiency based on capacity and production
    const totalEfficiency = productionAssets.reduce((sum, asset) => {
      const efficiency = asset.capacity && asset.annual_production 
        ? Math.min((asset.annual_production / (asset.capacity * 8760)) * 100, 100)
        : Math.random() * 20 + 75; // Random efficiency between 75-95%
      return sum + efficiency;
    }, 0);
    
    return totalEfficiency / productionAssets.length;
  }

  static calculateRegionDistribution(assets: Asset[]): Record<string, number> {
    return assets.reduce((acc, asset) => {
      const region = asset.regulatory_zone || 'Unknown';
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  static calculateTypeDistribution(assets: Asset[]): Record<string, number> {
    return assets.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  static calculateStatusDistribution(assets: Asset[]): Record<string, number> {
    return assets.reduce((acc, asset) => {
      acc[asset.status] = (acc[asset.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  static generateMonthlyTrends(): MonthlyTrend[] {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return months.map((month, index) => ({
      month,
      production: 1000 + (index * 150) + Math.random() * 200,
      efficiency: 75 + Math.random() * 20,
      capacity: 1200 + (index * 100),
      demand: 800 + (index * 120) + Math.random() * 150
    }));
  }

  static calculatePerformanceMetrics(assets: Asset[]): PerformanceMetric[] {
    const regionGroups = this.groupAssetsByRegion(assets);
    
    return Object.entries(regionGroups).map(([region, regionAssets]) => {
      const productionSum = regionAssets.reduce((sum, asset) => 
        sum + (asset.annual_production || 0), 0
      );
      
      const avgEfficiency = this.calculateAverageEfficiency(regionAssets);
      
      let status: 'optimal' | 'good' | 'needs-improvement';
      if (avgEfficiency >= 85) status = 'optimal';
      else if (avgEfficiency >= 75) status = 'good';
      else status = 'needs-improvement';
      
      return {
        region,
        assets: regionAssets.length,
        production: productionSum / 1000, // Convert to GW
        efficiency: avgEfficiency,
        status
      };
    });
  }

  static groupAssetsByRegion(assets: Asset[]): Record<string, Asset[]> {
    return assets.reduce((acc, asset) => {
      const region = asset.regulatory_zone || 'Unknown';
      if (!acc[region]) acc[region] = [];
      acc[region].push(asset);
      return acc;
    }, {} as Record<string, Asset[]>);
  }

  static generateKPICards(analytics: AnalyticsData): KPICard[] {
    return [
      {
        title: 'Total Production',
        value: `${(analytics.totalProduction / 1000000).toFixed(1)}M kg/year`,
        change: '+12.3%',
        trend: 'up',
        color: 'bg-green-500'
      },
      {
        title: 'Total Capacity',
        value: `${(analytics.totalCapacity / 1000).toFixed(1)}GW`,
        change: '+8.7%',
        trend: 'up',
        color: 'bg-blue-500'
      },
      {
        title: 'Avg Efficiency',
        value: `${analytics.averageEfficiency.toFixed(1)}%`,
        change: '+2.1%',
        trend: 'up',
        color: 'bg-purple-500'
      },
      {
        title: 'Carbon Savings',
        value: `${(analytics.carbonReduction / 1000000).toFixed(1)}M tons`,
        change: '+15.4%',
        trend: 'up',
        color: 'bg-emerald-500'
      }
    ];
  }

  static exportAnalyticsData(analytics: AnalyticsData): string {
    return JSON.stringify(analytics, null, 2);
  }

  static calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  static formatLargeNumber(num: number): string {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }
}

export default AnalyticsService;