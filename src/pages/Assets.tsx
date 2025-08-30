import { useState } from 'react';
import { AssetList } from '../components/AssetManagement/AssetList';
import { AssetModal } from '../components/AssetManagement/AssetModal';
import { useAssets } from '../hooks/useAssets';
import { Asset } from '../types';
import { Plus, Search, Filter, MapPin } from 'lucide-react';

const Assets = () => {
  const { assets, loading, createAsset, updateAsset, deleteAsset } = useAssets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    owner: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filters.type || asset.type === filters.type;
    const matchesStatus = !filters.status || asset.status === filters.status;
    const matchesOwner = !filters.owner || 
                        asset.owner.toLowerCase().includes(filters.owner.toLowerCase());
    
    return matchesSearch && matchesType && matchesStatus && matchesOwner;
  });

  const handleAddAsset = () => {
    setSelectedAsset(null);
    setIsModalOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleSaveAsset = async (assetData: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (selectedAsset) {
        await updateAsset(selectedAsset.id, assetData);
      } else {
        await createAsset(assetData);
      }
      setIsModalOpen(false);
      setSelectedAsset(null);
    } catch (error) {
      console.error('Failed to save asset:', error);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    try {
      await deleteAsset(assetId);
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  };

  const assetTypeStats = assets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Loading assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
            <p className="text-gray-600 mt-2">
              Manage and monitor your green hydrogen infrastructure assets
            </p>
          </div>
          <button
            onClick={handleAddAsset}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Asset</span>
          </button>
        </div>

        {/* Asset Type Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hydrogen Plants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assetTypeStats.hydrogen_plant || 0}
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Facilities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assetTypeStats.storage_facility || 0}
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Renewable Sources</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assetTypeStats.renewable_source || 0}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Demand Centers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assetTypeStats.demand_center || 0}
                </p>
              </div>
              <div className="bg-orange-500 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="hydrogen_plant">Hydrogen Plant</option>
                    <option value="storage_facility">Storage Facility</option>
                    <option value="renewable_source">Renewable Source</option>
                    <option value="demand_center">Demand Center</option>
                    <option value="pipeline">Pipeline</option>
                    <option value="distribution_hub">Distribution Hub</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="operational">Operational</option>
                    <option value="planned">Planned</option>
                    <option value="under_construction">Under Construction</option>
                    <option value="proposed">Proposed</option>
                    <option value="decommissioned">Decommissioned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner
                  </label>
                  <input
                    type="text"
                    value={filters.owner}
                    onChange={(e) => setFilters(prev => ({ ...prev, owner: e.target.value }))}
                    placeholder="Filter by owner..."
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filter Controls */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search assets by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Asset List */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Assets ({filteredAssets.length})
                </h2>
              </div>
              <AssetList
                assets={filteredAssets}
                onEditAsset={handleEditAsset}
                onDeleteAsset={handleDeleteAsset}
                onAssetSelect={(asset) => console.log('Selected asset:', asset)}
              />
            </div>
          </div>
        </div>

        {/* Asset Modal */}
        <AssetModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAsset(null);
          }}
          onSave={handleSaveAsset}
          editingAsset={selectedAsset}
        />
      </div>
    </div>
  );
};

export default Assets;