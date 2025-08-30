import { useState, useMemo } from 'react';
import { useAssets } from './useAssets';
import { AnalyticsService, AnalyticsData, KPICard, MonthlyTrend, PerformanceMetric } from '../services/analyticsService';

export function useAnalytics() {
  const { assets, loading: assetsLoading } = useAssets();
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('year');
  const [selectedMetric, setSelectedMetric] = useState<'production' | 'efficiency' | 'capacity'>('production');

  const analytics = useMemo((): AnalyticsData | null => {
    if (assetsLoading || assets.length === 0) return null;
    return AnalyticsService.calculateAnalytics(assets);
  }, [assets, assetsLoading]);

  const kpiCards = useMemo((): KPICard[] => {
    if (!analytics) return [];
    return AnalyticsService.generateKPICards(analytics);
  }, [analytics]);

  const chartData = useMemo(() => {
    if (!analytics) return [];
    
    return Object.entries(analytics.typeDistribution).map(([type, count]) => ({
      name: type.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()),
      count,
      capacity: Math.random() * 500 + 100 // Simulated capacity data
    }));
  }, [analytics]);

  const statusData = useMemo(() => {
    if (!analytics) return [];
    
    return Object.entries(analytics.statusDistribution).map(([status, count]) => ({
      name: status.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()),
      value: count
    }));
  }, [analytics]);

  const regionData = useMemo(() => {
    if (!analytics) return [];
    
    return Object.entries(analytics.regionDistribution)
      .map(([region, count]) => ({
        name: region,
        count,
        production: Math.random() * 1000 + 200,
        efficiency: Math.random() * 20 + 75
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [analytics]);

  const monthlyTrends = useMemo((): MonthlyTrend[] => {
    if (!analytics) return [];
    return analytics.monthlyTrends;
  }, [analytics]);

  const performanceMetrics = useMemo((): PerformanceMetric[] => {
    if (!analytics) return [];
    return analytics.performanceMetrics;
  }, [analytics]);

  const refreshAnalytics = async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const exportData = () => {
    if (!analytics) return null;
    
    const exportData = {
      analytics,
      timeRange,
      selectedMetric,
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `hydrogen-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const getFilteredTrends = () => {
    if (!monthlyTrends) return [];
    
    const monthsToShow = timeRange === 'month' ? 1 : timeRange === 'quarter' ? 3 : 12;
    return monthlyTrends.slice(-monthsToShow);
  };

  const calculateTotalGrowth = () => {
    const trends = getFilteredTrends();
    if (trends.length < 2) return 0;
    
    const firstValue = trends[0][selectedMetric as keyof MonthlyTrend] as number;
    const lastValue = trends[trends.length - 1][selectedMetric as keyof MonthlyTrend] as number;
    
    return AnalyticsService.calculateGrowthRate(lastValue, firstValue);
  };

  return {
    analytics,
    kpiCards,
    chartData,
    statusData,
    regionData,
    monthlyTrends: getFilteredTrends(),
    performanceMetrics,
    loading: loading || assetsLoading,
    timeRange,
    selectedMetric,
    setTimeRange,
    setSelectedMetric,
    refreshAnalytics,
    exportData,
    totalGrowth: calculateTotalGrowth()
  };
}