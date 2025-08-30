import { useState } from 'react';
import { Plus, Search, Filter, Download, RefreshCw, Eye, Edit, Trash2, MapPin } from 'lucide-react';
import { useAssetManagement, AssetFormData } from '../hooks/useAssetManagement';
import { EnhancedAssetModal } from '../components/AssetManagement/EnhancedAssetModal';
import { LoadingSpinner, LoadingOverlay } from '../components/Layout/LoadingSpinner';
import { Asset } from '../types';

const SimpleAssets = () => {
  const {
    assets,
    loading,
    isModalOpen,
    modalMode,
    selectedAsset,
    validationErrors,
    isSubmitting,
    handleCreateAsset,
    handleUpdateAsset,
    handleDeleteAsset,
    openCreateModal,
    openEditModal,
    openViewModal,
    closeModal,
    refreshAssets,
    exportAssets,
    searchAssets
  } = useAssetManagement();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');

  // Filter and search assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = searchQuery === '' || 
      searchAssets(searchQuery).some(searchAsset => searchAsset.id === asset.id);
    const matchesType = filterType === 'all' || asset.type === filterType;
    const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;
    const matchesRegion = filterRegion === 'all' || asset.regulatory_zone === filterRegion;
    
    return matchesSearch && matchesType && matchesStatus && matchesRegion;
  });

  const getStatusBadgeColor = (status: Asset['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'under_construction':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      case 'decommissioned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Asset['type']) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'hydrogen_plant':
        return <div className={`${iconClass} bg-green-500 rounded text-white flex items-center justify-center text-xs font-bold`}>H₂</div>;
      case 'storage_facility':
        return <div className={`${iconClass} bg-purple-500 rounded text-white flex items-center justify-center text-xs font-bold`}>ST</div>;
      case 'distribution_hub':
        return <div className={`${iconClass} bg-orange-500 rounded text-white flex items-center justify-center text-xs font-bold`}>DH</div>;
      case 'renewable_source':
        return <div className={`${iconClass} bg-emerald-500 rounded text-white flex items-center justify-center text-xs font-bold`}>RE</div>;
      case 'demand_center':
        return <div className={`${iconClass} bg-red-500 rounded text-white flex items-center justify-center text-xs font-bold`}>DC</div>;
      case 'pipeline':
        return <div className={`${iconClass} bg-blue-500 rounded text-white flex items-center justify-center text-xs font-bold`}>PL</div>;
      default:
        return <div className={`${iconClass} bg-gray-500 rounded text-white flex items-center justify-center text-xs font-bold`}>??</div>;
    }
  };

  const uniqueTypes = [...new Set(assets.map(asset => asset.type))];
  const uniqueStatuses = [...new Set(assets.map(asset => asset.status))];
  const uniqueRegions = [...new Set(assets.map(asset => asset.regulatory_zone).filter(Boolean))];

  const handleModalSubmit = async (data: AssetFormData) => {
    if (modalMode === 'create') {
      return await handleCreateAsset(data);
    } else if (modalMode === 'edit' && selectedAsset) {
      return await handleUpdateAsset(selectedAsset.id, data);
    }
    return { success: false };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading assets..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
              <p className="text-gray-600 mt-2">
                Manage your hydrogen ecosystem infrastructure assets
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={refreshAssets}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={exportAssets}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={openCreateModal}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Asset</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assets</p>
                  <p className="text-2xl font-bold text-gray-900">{assets.length}</p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">∑</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Operational</p>
                  <p className="text-2xl font-bold text-green-900">
                    {assets.filter(a => a.status === 'operational').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Under Construction</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {assets.filter(a => a.status === 'under_construction').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🏗</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Planned</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {assets.filter(a => a.status === 'planned').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📋</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                  </option>
                ))}
              </select>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Regions</option>
                {uniqueRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <div className="flex items-center text-sm text-gray-600">
                <Filter className="w-4 h-4 mr-2" />
                {filteredAssets.length} of {assets.length} assets
              </div>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <LoadingOverlay isLoading={loading}>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(asset.type)}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                            <div className="text-sm text-gray-500">{asset.regulatory_zone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {asset.type.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                        </div>
                        {asset.subtype && (
                          <div className="text-sm text-gray-500">
                            {asset.subtype.replace(/_/g, ' ')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(asset.status)}`}>
                          {asset.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {asset.latitude.toFixed(4)}, {asset.longitude.toFixed(4)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asset.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asset.capacity} {asset.capacity_unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openViewModal(asset)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(asset)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Edit asset"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAsset(asset.id, asset.name)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAssets.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <div className="text-lg font-medium mb-2">No assets found</div>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              </div>
            )}
          </div>
        </LoadingOverlay>

        {/* Enhanced Asset Modal */}
        <EnhancedAssetModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          asset={selectedAsset}
          mode={modalMode}
          validationErrors={validationErrors}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default SimpleAssets;