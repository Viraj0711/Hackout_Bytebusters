import { useState, useCallback } from 'react';
import { useAssets } from './useAssets';
import { Asset } from '../types';
import { ValidationService, ValidationResult } from '../services/validationService';
import { notificationService } from '../services/notificationService';

export type AssetFormData = Omit<Asset, 'id' | 'created_at' | 'updated_at' | 'created_by'>;

export function useAssetManagement() {
  const { assets, loading, createAsset, updateAsset, deleteAsset, fetchAssets } = useAssets();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const validateAssetData = useCallback((data: Partial<Asset>): ValidationResult => {
    const result = ValidationService.validateAsset(data);
    
    const errorMap: Record<string, string> = {};
    result.errors.forEach(error => {
      errorMap[error.field] = error.message;
    });
    
    setValidationErrors(errorMap);
    return result;
  }, []);

  const handleCreateAsset = useCallback(async (data: AssetFormData) => {
    setIsSubmitting(true);
    
    try {
      const validation = validateAssetData(data);
      if (!validation.isValid) {
        notificationService.error('Please fix validation errors before submitting');
        setIsSubmitting(false);
        return { success: false, errors: validation.errors };
      }

      const result = await createAsset({
        ...data,
        created_by: 'current-user' // In real app, get from auth context
      });

      if (result.error) {
        notificationService.error(result.error, 'Failed to create asset');
        return { success: false, error: result.error };
      }

      notificationService.success('Asset created successfully!');
      setIsModalOpen(false);
      setValidationErrors({});
      return { success: true, data: result.data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      notificationService.error(errorMessage, 'Creation failed');
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [createAsset, validateAssetData]);

  const handleUpdateAsset = useCallback(async (id: string, data: Partial<Asset>) => {
    setIsSubmitting(true);
    
    try {
      const validation = validateAssetData(data);
      if (!validation.isValid) {
        notificationService.error('Please fix validation errors before submitting');
        setIsSubmitting(false);
        return { success: false, errors: validation.errors };
      }

      const result = await updateAsset(id, data);

      if (result.error) {
        notificationService.error(result.error, 'Failed to update asset');
        return { success: false, error: result.error };
      }

      notificationService.success('Asset updated successfully!');
      setIsModalOpen(false);
      setValidationErrors({});
      return { success: true, data: result.data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      notificationService.error(errorMessage, 'Update failed');
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [updateAsset, validateAssetData]);

  const handleDeleteAsset = useCallback(async (id: string, assetName?: string) => {
    try {
      const confirmMessage = assetName 
        ? `Are you sure you want to delete "${assetName}"? This action cannot be undone.`
        : 'Are you sure you want to delete this asset? This action cannot be undone.';
      
      if (!window.confirm(confirmMessage)) {
        return { success: false, cancelled: true };
      }

      const result = await deleteAsset(id);

      if (result.error) {
        notificationService.error(result.error, 'Failed to delete asset');
        return { success: false, error: result.error };
      }

      notificationService.success('Asset deleted successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      notificationService.error(errorMessage, 'Deletion failed');
      return { success: false, error: errorMessage };
    }
  }, [deleteAsset]);

  const openCreateModal = useCallback(() => {
    setSelectedAsset(null);
    setModalMode('create');
    setValidationErrors({});
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
    setModalMode('edit');
    setValidationErrors({});
    setIsModalOpen(true);
  }, []);

  const openViewModal = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
    setModalMode('view');
    setValidationErrors({});
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedAsset(null);
    setValidationErrors({});
    setIsSubmitting(false);
  }, []);

  const refreshAssets = useCallback(() => {
    fetchAssets();
    notificationService.info('Assets refreshed');
  }, [fetchAssets]);

  const exportAssets = useCallback(() => {
    try {
      const exportData = {
        assets,
        exportedAt: new Date().toISOString(),
        totalCount: assets.length
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `hydrogen-assets-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      notificationService.success('Assets exported successfully!');
    } catch {
      notificationService.error('Failed to export assets');
    }
  }, [assets]);

  const getAssetsByType = useCallback((type: Asset['type']) => {
    return assets.filter(asset => asset.type === type);
  }, [assets]);

  const getAssetsByStatus = useCallback((status: Asset['status']) => {
    return assets.filter(asset => asset.status === status);
  }, [assets]);

  const getAssetsByRegion = useCallback((region: string) => {
    return assets.filter(asset => asset.regulatory_zone === region);
  }, [assets]);

  const searchAssets = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return assets.filter(asset => 
      asset.name.toLowerCase().includes(lowercaseQuery) ||
      asset.owner.toLowerCase().includes(lowercaseQuery) ||
      asset.type.toLowerCase().includes(lowercaseQuery) ||
      asset.status.toLowerCase().includes(lowercaseQuery) ||
      (asset.regulatory_zone && asset.regulatory_zone.toLowerCase().includes(lowercaseQuery))
    );
  }, [assets]);

  return {
    // Data
    assets,
    selectedAsset,
    validationErrors,
    
    // State
    loading,
    isSubmitting,
    isModalOpen,
    modalMode,
    
    // Actions
    handleCreateAsset,
    handleUpdateAsset,
    handleDeleteAsset,
    openCreateModal,
    openEditModal,
    openViewModal,
    closeModal,
    refreshAssets,
    exportAssets,
    
    // Utilities
    validateAssetData,
    getAssetsByType,
    getAssetsByStatus,
    getAssetsByRegion,
    searchAssets
  };
}