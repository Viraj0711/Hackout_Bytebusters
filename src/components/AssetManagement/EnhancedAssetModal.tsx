import { useState, useEffect } from 'react';
import { X, MapPin, Factory, Battery, Fuel, Wind, Truck, Building } from 'lucide-react';
import { Asset } from '../../types';
import { AssetFormData } from '../../hooks/useAssetManagement';
import { LoadingButton } from '../Layout/LoadingSpinner';

interface EnhancedAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssetFormData) => Promise<{ success: boolean }>;
  asset?: Asset | null;
  mode: 'create' | 'edit' | 'view';
  validationErrors?: Record<string, string>;
  isSubmitting?: boolean;
}

const assetTypes = [
  { value: 'hydrogen_plant', label: 'Hydrogen Plant', icon: Factory },
  { value: 'storage_facility', label: 'Storage Facility', icon: Battery },
  { value: 'distribution_hub', label: 'Distribution Hub', icon: Truck },
  { value: 'renewable_source', label: 'Renewable Source', icon: Wind },
  { value: 'demand_center', label: 'Demand Center', icon: Building },
  { value: 'pipeline', label: 'Pipeline', icon: Fuel }
];

const assetStatuses = [
  { value: 'operational', label: 'Operational' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'planned', label: 'Planned' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'decommissioned', label: 'Decommissioned' }
];

const safetyRatings = [
  { value: 'A', label: 'A - Excellent' },
  { value: 'B', label: 'B - Good' },
  { value: 'C', label: 'C - Fair' },
  { value: 'D', label: 'D - Poor' }
];

const regions = [
  'Europe-West', 'Europe-Central', 'Europe-North',
  'Asia-Pacific', 'Asia-East', 'Asia-South', 'Asia-Southeast', 'Asia-Central',
  'North America', 'South America',
  'Africa-North', 'Australia-Oceania', 'Middle East'
];

export function EnhancedAssetModal({
  isOpen,
  onClose,
  onSubmit,
  asset,
  mode,
  validationErrors = {},
  isSubmitting = false
}: EnhancedAssetModalProps) {
  const [formData, setFormData] = useState<AssetFormData>({
    name: '',
    type: 'hydrogen_plant',
    status: 'planned',
    latitude: 0,
    longitude: 0,
    owner: '',
    description: '',
    regulatory_zone: 'Europe-West',
    capacity: 0,
    capacity_unit: 'MW',
    safety_rating: 'A'
  });

  useEffect(() => {
    if (asset && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: asset.name,
        type: asset.type,
        subtype: asset.subtype,
        status: asset.status,
        latitude: asset.latitude,
        longitude: asset.longitude,
        owner: asset.owner,
        description: asset.description || '',
        regulatory_zone: asset.regulatory_zone || 'Europe-West',
        capacity: asset.capacity || 0,
        capacity_unit: asset.capacity_unit || 'MW',
        cost_estimate: asset.cost_estimate,
        annual_production: asset.annual_production,
        renewable_capacity: asset.renewable_capacity,
        demand_forecast: asset.demand_forecast,
        environmental_impact_score: asset.environmental_impact_score,
        safety_rating: asset.safety_rating || 'A',
        storage_pressure: asset.storage_pressure,
        pipeline_diameter: asset.pipeline_diameter,
        connection_points: asset.connection_points
      });
    } else if (mode === 'create') {
      // Reset form for new asset
      setFormData({
        name: '',
        type: 'hydrogen_plant',
        status: 'planned',
        latitude: 0,
        longitude: 0,
        owner: '',
        description: '',
        regulatory_zone: 'Europe-West',
        capacity: 0,
        capacity_unit: 'MW',
        safety_rating: 'A'
      });
    }
  }, [asset, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    
    const result = await onSubmit(formData);
    if (result.success) {
      onClose();
    }
  };

  const handleChange = (field: keyof AssetFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isReadOnly = mode === 'view';
  const title = mode === 'create' ? 'Create New Asset' : mode === 'edit' ? 'Edit Asset' : 'Asset Details';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-300'
                    } ${isReadOnly ? 'bg-gray-50' : ''}`}
                    placeholder="Enter asset name"
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    disabled={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      validationErrors.type ? 'border-red-500' : 'border-gray-300'
                    } ${isReadOnly ? 'bg-gray-50' : ''}`}
                  >
                    {assetTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {validationErrors.type && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    disabled={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      validationErrors.status ? 'border-red-500' : 'border-gray-300'
                    } ${isReadOnly ? 'bg-gray-50' : ''}`}
                  >
                    {assetStatuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                  {validationErrors.status && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.status}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner</label>
                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(e) => handleChange('owner', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      validationErrors.owner ? 'border-red-500' : 'border-gray-300'
                    } ${isReadOnly ? 'bg-gray-50' : ''}`}
                    placeholder="Enter owner name"
                  />
                  {validationErrors.owner && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.owner}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Regulatory Zone</label>
                  <select
                    value={formData.regulatory_zone}
                    onChange={(e) => handleChange('regulatory_zone', e.target.value)}
                    disabled={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      isReadOnly ? 'bg-gray-50' : ''
                    }`}
                  >
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location & Technical Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location & Technical Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => handleChange('latitude', parseFloat(e.target.value) || 0)}
                      readOnly={isReadOnly}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        validationErrors.latitude ? 'border-red-500' : 'border-gray-300'
                      } ${isReadOnly ? 'bg-gray-50' : ''}`}
                      placeholder="0.0"
                    />
                    {validationErrors.latitude && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.latitude}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => handleChange('longitude', parseFloat(e.target.value) || 0)}
                      readOnly={isReadOnly}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        validationErrors.longitude ? 'border-red-500' : 'border-gray-300'
                      } ${isReadOnly ? 'bg-gray-50' : ''}`}
                      placeholder="0.0"
                    />
                    {validationErrors.longitude && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.longitude}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                    <input
                      type="number"
                      value={formData.capacity || ''}
                      onChange={(e) => handleChange('capacity', parseFloat(e.target.value) || 0)}
                      readOnly={isReadOnly}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        validationErrors.capacity ? 'border-red-500' : 'border-gray-300'
                      } ${isReadOnly ? 'bg-gray-50' : ''}`}
                      placeholder="0"
                    />
                    {validationErrors.capacity && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.capacity}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                    <select
                      value={formData.capacity_unit}
                      onChange={(e) => handleChange('capacity_unit', e.target.value)}
                      disabled={isReadOnly}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        isReadOnly ? 'bg-gray-50' : ''
                      }`}
                    >
                      <option value="MW">MW</option>
                      <option value="tonnes">Tonnes</option>
                      <option value="kg/hour">kg/hour</option>
                      <option value="tonnes/day">Tonnes/day</option>
                      <option value="kg/year">kg/year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Safety Rating</label>
                  <select
                    value={formData.safety_rating}
                    onChange={(e) => handleChange('safety_rating', e.target.value)}
                    disabled={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      isReadOnly ? 'bg-gray-50' : ''
                    }`}
                  >
                    {safetyRatings.map(rating => (
                      <option key={rating.value} value={rating.value}>{rating.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost Estimate (USD)</label>
                  <input
                    type="number"
                    value={formData.cost_estimate || ''}
                    onChange={(e) => handleChange('cost_estimate', parseFloat(e.target.value) || 0)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      validationErrors.cost_estimate ? 'border-red-500' : 'border-gray-300'
                    } ${isReadOnly ? 'bg-gray-50' : ''}`}
                    placeholder="0"
                  />
                  {validationErrors.cost_estimate && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.cost_estimate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                readOnly={isReadOnly}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isReadOnly ? 'bg-gray-50' : 'border-gray-300'
                }`}
                placeholder="Enter asset description..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {mode === 'view' ? 'Close' : 'Cancel'}
            </button>
            {mode !== 'view' && (
              <LoadingButton
                type="submit"
                isLoading={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {mode === 'create' ? 'Create Asset' : 'Update Asset'}
              </LoadingButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}