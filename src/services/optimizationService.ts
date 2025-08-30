import { OptimizationConstraints, Recommendation, Asset } from '../types';

interface RenewableSource {
  lat: number;
  lng: number;
  capacity: number;
  type: string;
}

interface RenewableSourceWithDistance extends RenewableSource {
  distance: number;
}

interface DemandCenterWithDistance {
  latitude: number;
  longitude: number;
  demand: number;
  distance: number;
}

// Advanced Green Hydrogen Optimization Service
// In production, this would integrate with sophisticated optimization algorithms
export class OptimizationService {
  static async findOptimalSites(
    constraints: OptimizationConstraints,
    existingAssets: Asset[]
  ): Promise<Recommendation[]> {
    // Simulate complex optimization processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Filter existing assets by type for analysis
    const renewableSources = existingAssets.filter(asset => asset.type === 'renewable_source');
    const demandCenters = existingAssets.filter(asset => asset.type === 'demand_center');
    const existingInfrastructure = existingAssets.filter(asset => 
      ['hydrogen_plant', 'pipeline', 'storage_facility', 'distribution_hub'].includes(asset.type)
    );

    // Mock additional renewable potential data points
    const additionalRenewablePotential: RenewableSource[] = [
      { lat: 34.0522, lng: -118.2437, capacity: 800, type: 'solar' }, // Los Angeles
      { lat: 29.7604, lng: -95.3698, capacity: 1200, type: 'wind' }, // Houston
      { lat: 53.5511, lng: 9.9937, capacity: 1000, type: 'wind' }, // Hamburg
      { lat: 51.5074, lng: -0.1278, capacity: 600, type: 'solar' }, // London
      { lat: 35.6762, lng: 139.6503, capacity: 500, type: 'solar' }, // Tokyo
      { lat: 40.7128, lng: -74.0060, capacity: 700, type: 'wind' }, // New York
      { lat: 37.7749, lng: -122.4194, capacity: 900, type: 'solar' }, // San Francisco
      { lat: 52.5200, lng: 13.4050, capacity: 800, type: 'wind' }, // Berlin
    ];

    const allRenewableSources: RenewableSource[] = [
      ...renewableSources.map(asset => ({
        lat: asset.latitude,
        lng: asset.longitude,
        capacity: asset.renewable_capacity || 0,
        type: asset.subtype || 'renewable'
      })),
      ...additionalRenewablePotential
    ];

    const recommendations: Recommendation[] = [];
    
    // Generate sophisticated recommendations based on multiple criteria
    for (let i = 0; i < 10; i++) {
      // Generate candidate locations with some clustering around existing infrastructure
      let baseLatitude, baseLongitude;
      
      if (Math.random() > 0.3 && existingInfrastructure.length > 0) {
        // 70% chance to cluster near existing infrastructure
        const referenceAsset = existingInfrastructure[Math.floor(Math.random() * existingInfrastructure.length)];
        baseLatitude = referenceAsset.latitude + (Math.random() - 0.5) * 2;
        baseLongitude = referenceAsset.longitude + (Math.random() - 0.5) * 2;
      } else {
        // 30% chance for completely new locations
        baseLatitude = 30 + Math.random() * 30; // Focus on temperate regions
        baseLongitude = -120 + Math.random() * 180;
      }

      // Find nearest renewable source
      const nearestRenewable: RenewableSourceWithDistance = allRenewableSources.reduce((nearest, source) => {
        const distance = this.calculateDistance(baseLatitude, baseLongitude, source.lat, source.lng);
        const sourceWithDistance: RenewableSourceWithDistance = { ...source, distance };
        return distance < nearest.distance ? sourceWithDistance : nearest;
      }, { lat: 0, lng: 0, capacity: 0, type: '', distance: Infinity } as RenewableSourceWithDistance);

      // Find nearest demand center
      const nearestDemand: DemandCenterWithDistance = demandCenters.reduce((nearest, center) => {
        const distance = this.calculateDistance(baseLatitude, baseLongitude, center.latitude, center.longitude);
        const centerWithDistance: DemandCenterWithDistance = { 
          latitude: center.latitude,
          longitude: center.longitude,
          distance,
          demand: center.demand_forecast || 0
        };
        return distance < nearest.distance ? centerWithDistance : nearest;
      }, { latitude: 0, longitude: 0, demand: 0, distance: Infinity });

      // Calculate infrastructure synergy
      const infrastructureSynergy = this.calculateInfrastructureSynergy(
        baseLatitude, 
        baseLongitude, 
        existingInfrastructure
      );

      // Advanced scoring algorithm
      let score = this.calculateOptimizationScore(
        constraints,
        nearestRenewable,
        nearestDemand,
        infrastructureSynergy,
        baseLatitude,
        baseLongitude
      );

      // Filter based on constraints
      if (nearestRenewable.distance <= constraints.maxDistance) {
        const estimatedCost = this.calculateEstimatedCost(
          constraints,
          nearestRenewable,
          nearestDemand,
          infrastructureSynergy
        );
        
        const paybackPeriod = this.calculatePaybackPeriod(estimatedCost, constraints.minCapacity);
        const riskAssessment = this.assessRisk(nearestRenewable, nearestDemand, infrastructureSynergy);
        
        if (estimatedCost <= constraints.maxCost) {
          recommendations.push({
            id: `green-h2-rec-${Date.now()}-${i}`,
            latitude: baseLatitude,
            longitude: baseLongitude,
            score,
            reasoning: this.generateReasoning(
              score,
              nearestRenewable,
              nearestDemand,
              infrastructureSynergy,
              constraints
            ),
            estimated_cost: estimatedCost,
            renewable_proximity: nearestRenewable.distance,
            demand_proximity: nearestDemand.distance,
            environmental_impact: this.calculateEnvironmentalImpact(nearestRenewable, constraints),
            regulatory_compliance: score > 60, // Simplified compliance check
            infrastructure_synergy: infrastructureSynergy,
            risk_assessment: riskAssessment,
            recommended_capacity: Math.max(constraints.minCapacity, nearestDemand.demand / 1000 || constraints.minCapacity),
            payback_period: paybackPeriod,
            created_at: new Date().toISOString(),
            created_by: 'optimization-service'
          });
        }
      }
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // Return top 8 recommendations
  }

  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static calculateInfrastructureSynergy(
    lat: number, 
    lng: number, 
    infrastructure: Asset[]
  ): number {
    let synergy = 0;
    
    infrastructure.forEach(asset => {
      const distance = this.calculateDistance(lat, lng, asset.latitude, asset.longitude);
      if (distance < 50) { // Within 50km
        const proximityBonus = Math.max(0, (50 - distance) / 50) * 10;
        
        // Different asset types provide different synergy values
        switch (asset.type) {
          case 'pipeline':
            synergy += proximityBonus * 1.5; // Pipelines provide high transport synergy
            break;
          case 'storage_facility':
            synergy += proximityBonus * 1.3; // Storage provides good synergy
            break;
          case 'distribution_hub':
            synergy += proximityBonus * 1.2; // Distribution provides moderate synergy
            break;
          case 'hydrogen_plant':
            synergy += proximityBonus * 0.8; // Other plants provide some synergy
            break;
        }
      }
    });
    
    return Math.min(synergy, 100); // Cap at 100
  }

  private static calculateOptimizationScore(
    constraints: OptimizationConstraints,
    nearestRenewable: RenewableSourceWithDistance,
    nearestDemand: DemandCenterWithDistance,
    infrastructureSynergy: number,
    lat: number,
    _lng: number
  ): number {
    let score = 50; // Base score
    
    // Renewable proximity scoring (0-25 points)
    if (constraints.renewableProximity) {
      const renewableScore = Math.max(0, (constraints.maxDistance - nearestRenewable.distance) / constraints.maxDistance * 25);
      score += renewableScore;
    }
    
    // Demand proximity scoring (0-20 points)
    if (constraints.demandProximity && nearestDemand.distance < 999) {
      const demandScore = Math.max(0, (200 - Math.min(nearestDemand.distance, 200)) / 200 * 20);
      score += demandScore;
    }
    
    // Infrastructure synergy scoring (0-20 points)
    if (constraints.existingInfrastructure) {
      score += (infrastructureSynergy / 100) * 20;
    }
    
    // Renewable capacity bonus (0-15 points)
    const capacityScore = Math.min(nearestRenewable.capacity / 1000 * 15, 15);
    score += capacityScore;
    
    // Environmental considerations (0-10 points)
    const environmentalBonus = nearestRenewable.type === 'wind' ? 8 : 
                              nearestRenewable.type === 'solar' ? 6 : 4;
    score += environmentalBonus;
    
    // Geographic suitability (0-10 points)
    const latitudeSuitability = Math.max(0, 10 - Math.abs(lat - 45) / 5); // Prefer temperate latitudes
    score += latitudeSuitability;
    
    // Add some controlled randomness for realistic variation
    score += (Math.random() - 0.5) * 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private static calculateEstimatedCost(
    constraints: OptimizationConstraints,
    nearestRenewable: RenewableSourceWithDistance,
    nearestDemand: DemandCenterWithDistance,
    infrastructureSynergy: number
  ): number {
    let baseCost = constraints.minCapacity * 1.5; // Base cost per unit capacity
    
    // Distance cost factors
    const renewableDistanceCost = nearestRenewable.distance * 0.5;
    const demandDistanceCost = nearestDemand.distance * 0.3;
    
    // Infrastructure synergy cost reduction
    const synergyDiscount = (infrastructureSynergy / 100) * baseCost * 0.2;
    
    // Scale and complexity factors
    const scaleFactor = Math.max(1, constraints.minCapacity / 100);
    
    const totalCost = baseCost + renewableDistanceCost + demandDistanceCost - synergyDiscount;
    
    return Math.max(50, totalCost * scaleFactor);
  }

  private static calculatePaybackPeriod(cost: number, capacity: number): number {
    // Simplified payback calculation based on hydrogen economics
    const annualRevenue = capacity * 0.8 * 365 * 4; // Rough revenue estimate ($/kg * capacity * days * $/kg)
    const operatingCosts = cost * 0.1; // 10% of CAPEX annually
    const netAnnualCashFlow = annualRevenue - operatingCosts;
    
    if (netAnnualCashFlow <= 0) return 25; // Maximum reasonable payback period
    
    return Math.min(25, (cost * 1000000) / netAnnualCashFlow / 1000000 * 10); // Convert to years
  }

  private static assessRisk(
    nearestRenewable: RenewableSourceWithDistance,
    nearestDemand: DemandCenterWithDistance,
    infrastructureSynergy: number
  ): 'low' | 'medium' | 'high' {
    let riskScore = 0;
    
    // Distance risks
    if (nearestRenewable.distance > 100) riskScore += 2;
    else if (nearestRenewable.distance > 50) riskScore += 1;
    
    if (nearestDemand.distance > 200) riskScore += 2;
    else if (nearestDemand.distance > 100) riskScore += 1;
    
    // Infrastructure risks
    if (infrastructureSynergy < 20) riskScore += 2;
    else if (infrastructureSynergy < 50) riskScore += 1;
    
    // Renewable capacity risks
    if (nearestRenewable.capacity < 200) riskScore += 1;
    
    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  }

  private static calculateEnvironmentalImpact(
    nearestRenewable: RenewableSourceWithDistance,
    constraints: OptimizationConstraints
  ): number {
    let impact = constraints.environmentalScore || 7;
    
    // Renewable source type impact
    if (nearestRenewable.type === 'wind') impact += 1;
    if (nearestRenewable.type === 'solar') impact += 0.5;
    
    // Proximity impact (less transmission = better environmental score)
    if (nearestRenewable.distance < 25) impact += 0.5;
    
    return Math.min(10, Math.max(1, impact));
  }

  private static generateReasoning(
    score: number,
    nearestRenewable: RenewableSourceWithDistance,
    nearestDemand: DemandCenterWithDistance,
    infrastructureSynergy: number,
    constraints: OptimizationConstraints
  ): string {
    const reasons = [];
    
    if (score >= 85) {
      reasons.push("Exceptional location with optimal conditions");
    } else if (score >= 70) {
      reasons.push("Highly suitable site with strong potential");
    } else if (score >= 55) {
      reasons.push("Good location with acceptable trade-offs");
    } else {
      reasons.push("Viable option requiring careful consideration");
    }
    
    reasons.push(`Located ${nearestRenewable.distance.toFixed(1)}km from ${nearestRenewable.capacity.toFixed(0)}MW ${nearestRenewable.type} renewable source`);
    
    if (nearestDemand.distance < 999) {
      reasons.push(`${nearestDemand.distance.toFixed(1)}km from major demand center`);
    }
    
    if (infrastructureSynergy > 50) {
      reasons.push("Excellent synergy with existing infrastructure");
    } else if (infrastructureSynergy > 20) {
      reasons.push("Good integration potential with nearby infrastructure");
    }
    
    if (constraints.environmentalScore > 8) {
      reasons.push("Meets high environmental standards");
    }
    
    return reasons.join(". ") + ".";
  }
}