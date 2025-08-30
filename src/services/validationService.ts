import { Asset } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class ValidationService {
  static validateAsset(asset: Partial<Asset>): ValidationResult {
    const errors: ValidationError[] = [];

    // Required fields
    if (!asset.name?.trim()) {
      errors.push({ field: 'name', message: 'Asset name is required' });
    }

    if (!asset.type) {
      errors.push({ field: 'type', message: 'Asset type is required' });
    }

    if (!asset.status) {
      errors.push({ field: 'status', message: 'Asset status is required' });
    }

    if (!asset.owner?.trim()) {
      errors.push({ field: 'owner', message: 'Asset owner is required' });
    }

    // Location validation
    if (asset.latitude === undefined || asset.latitude === null) {
      errors.push({ field: 'latitude', message: 'Latitude is required' });
    } else if (asset.latitude < -90 || asset.latitude > 90) {
      errors.push({ field: 'latitude', message: 'Latitude must be between -90 and 90' });
    }

    if (asset.longitude === undefined || asset.longitude === null) {
      errors.push({ field: 'longitude', message: 'Longitude is required' });
    } else if (asset.longitude < -180 || asset.longitude > 180) {
      errors.push({ field: 'longitude', message: 'Longitude must be between -180 and 180' });
    }

    // Capacity validation
    if (asset.capacity !== undefined && asset.capacity < 0) {
      errors.push({ field: 'capacity', message: 'Capacity must be positive' });
    }

    // Environmental score validation
    if (asset.environmental_impact_score !== undefined && 
        (asset.environmental_impact_score < 0 || asset.environmental_impact_score > 10)) {
      errors.push({ field: 'environmental_impact_score', message: 'Environmental score must be between 0 and 10' });
    }

    // Cost validation
    if (asset.cost_estimate !== undefined && asset.cost_estimate < 0) {
      errors.push({ field: 'cost_estimate', message: 'Cost estimate must be positive' });
    }

    // Production validation
    if (asset.annual_production !== undefined && asset.annual_production < 0) {
      errors.push({ field: 'annual_production', message: 'Annual production must be positive' });
    }

    // Demand validation
    if (asset.demand_forecast !== undefined && asset.demand_forecast < 0) {
      errors.push({ field: 'demand_forecast', message: 'Demand forecast must be positive' });
    }

    // Renewable capacity validation
    if (asset.renewable_capacity !== undefined && asset.renewable_capacity < 0) {
      errors.push({ field: 'renewable_capacity', message: 'Renewable capacity must be positive' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateCoordinates(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): ValidationResult {
    const errors: ValidationError[] = [];

    if (password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
    }

    if (!/[A-Z]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter' });
    }

    if (!/[a-z]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter' });
    }

    if (!/\d/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one number' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>"'&]/g, '');
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[+]?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s-().]/g, ''));
  }
}

export default ValidationService;