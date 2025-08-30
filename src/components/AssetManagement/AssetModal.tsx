import React, { useState, useEffect } from 'react';
import { X, MapPin, Building, Activity, Zap } from 'lucide-react';
import { Asset } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) => Promise<any>;
  editingAsset?: Asset | null;
  initialPosition?: { lat: number; lng: number };
}

const assetTypeOptions = [
  { value: 'plant', label: 'Hydrogen Plant', icon: Building },
  { value: 'pipeline', label: 'Pipeline', icon: MapPin },
  { value: 'storage', label: 'Storage Site', icon: Activity },
  { value: 'distribution_hub', label: 'Distribution Hub', icon: Zap },
  { value: 'renewable_source', label: 'Renewable Source', icon: Zap },
];

const statusOptions = [
  { value: 'operational', label: 'Operational' },
  { value: 'planned', label: 'Planned' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'decommissioned', label: 'Decommissioned' },
];

const regionOptions = [
  { value: 'north', label: 'North Region' },
  { value: 'south', label: 'South Region' },
  { value: 'east', label: 'East Region' },
  { value: 'west', label: 'West Region' },
  { value: 'central', label: 'Central Region' },
];

export function AssetModal({ isOpen, onClose, onSave, editingAsset, initialPosition }: AssetModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    type: 'plant' as Asset['type'],
    status: 'planned' as Asset['status'],
    latitude: 0,
    longitude: 0,
    capacity: '',
    capacity_unit: 'MW',
    owner: '',
    description: '',
    regulatory_zone: '',
    cost_estimate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingAsset) {
      setFormData({
        name: editingAsset.name,
        type: editingAsset.type,
        status: editingAsset.status,
        latitude: editingAsset.latitude,
        longitude: editingAsset.longitude,
        capacity: editingAsset.capacity?.toString() || '',
        capacity_unit: editingAsset.capacity_unit || 'MW',
        owner: editingAsset.owner,
        description: editingAsset.description || '',
        regulatory_zone: editingAsset.regulatory_zone || '',
        cost_estimate: editingAsset.cost_estimate?.toString() || '',
      });
    } else if (initialPosition) {
      setFormData(prev => ({
        ...prev,
        latitude: initialPosition.lat,
        longitude: initialPosition.lng,
      }));
    }
  }, [editingAsset, initialPosition]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const assetData = {
        name: formData.name,
        type: formData.type,
        status: formData.status,
        latitude: formData.latitude,
        longitude: formData.longitude,
        capacity: formData.capacity ? parseFloat(formData.capacity) : null,
        capacity_unit: formData.capacity_unit || null,
        owner: formData.owner,
        description: formData.description || null,
        regulatory_zone: formData.regulatory_zone || null,
        cost_estimate: formData.cost_estimate ? parseFloat(formData.cost_estimate) : null,
        created_by: user.id,
      };

      const { error } = await onSave(assetData);
      if (error) throw new Error(error);
      
      onClose();
      setFormData({
        name: '',
        type: 'plant',
        status: 'planned',
        latitude: 0,
        longitude: 0,
        capacity: '',
        capacity_unit: 'MW',
        owner: '',
        description: '',
        regulatory_zone: '',
        cost_estimate: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl mx-4 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingAsset ? 'Edit Asset' : 'Add New Asset'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Asset Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter asset name"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Asset Type *
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Asset['type'] })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                {assetTypeOptions.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Asset['status'] })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                {statusOptions.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                Latitude *
              </label>
              <input
                type="number"
                id="latitude"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="51.505"
                required
              />
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                Longitude *
              </label>
              <input
                type="number"
                id="longitude"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="-0.09"
                required
              />
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="100"
              />
            </div>

            <div>
              <label htmlFor="capacity_unit" className="block text-sm font-medium text-gray-700 mb-2">
                Capacity Unit
              </label>
              <select
                id="capacity_unit"
                value={formData.capacity_unit}
                onChange={(e) => setFormData({ ...formData, capacity_unit: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="MW">MW</option>
                <option value="GW">GW</option>
                <option value="tonnes/day">tonnes/day</option>
                <option value="km">km</option>
                <option value="m³">m³</option>
              </select>
            </div>

            <div>
              <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-2">
                Owner *
              </label>
              <input
                type="text"
                id="owner"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Company name"
                required
              />
            </div>

            <div>
              <label htmlFor="regulatory_zone" className="block text-sm font-medium text-gray-700 mb-2">
                Regulatory Zone
              </label>
              <select
                id="regulatory_zone"
                value={formData.regulatory_zone}
                onChange={(e) => setFormData({ ...formData, regulatory_zone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select zone</option>
                {regionOptions.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cost_estimate" className="block text-sm font-medium text-gray-700 mb-2">
                Cost Estimate (Million USD)
              </label>
              <input
                type="number"
                id="cost_estimate"
                value={formData.cost_estimate}
                onChange={(e) => setFormData({ ...formData, cost_estimate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="50"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Additional details about this asset..."
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Saving...' : editingAsset ? 'Update Asset' : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}