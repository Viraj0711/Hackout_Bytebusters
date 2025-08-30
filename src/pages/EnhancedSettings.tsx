import React, { useState } from 'react';
import { Save, RefreshCw, Shield, Monitor, Database, Wifi, Eye, EyeOff, AlertTriangle, CheckCircle, Settings as SettingsIcon } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { LoadingSpinner } from '../components/Layout/LoadingSpinner';

interface SystemSettings {
  general: {
    systemName: string;
    timezone: string;
    language: string;
    dateFormat: string;
    theme: 'light' | 'dark' | 'auto';
  };
  monitoring: {
    refreshInterval: number;
    alertThresholds: {
      temperature: number;
      pressure: number;
      efficiency: number;
    };
    retentionPeriod: number;
    enableRealTimeAlerts: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  security: {
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
    twoFactorAuth: boolean;
    auditLogging: boolean;
    encryptionLevel: 'standard' | 'high' | 'maximum';
  };
  integrations: {
    supabaseConfig: {
      url: string;
      key: string;
    };
    apiEndpoints: {
      weatherService: string;
      carbonTracker: string;
      priceTracker: string;
    };
    enableWebhooks: boolean;
    webhookUrl: string;
  };
  performance: {
    cacheSize: number;
    maxConcurrentUsers: number;
    dataCompression: boolean;
    enableCDN: boolean;
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
  };
}

const EnhancedSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'monitoring' | 'security' | 'integrations' | 'performance'>('general');
  const [loading, setLoading] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);

  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      systemName: 'Hydrogen Ecosystem Platform',
      timezone: 'UTC',
      language: 'en-US',
      dateFormat: 'MM/DD/YYYY',
      theme: 'light'
    },
    monitoring: {
      refreshInterval: 5000,
      alertThresholds: {
        temperature: 75,
        pressure: 23,
        efficiency: 80
      },
      retentionPeriod: 90,
      enableRealTimeAlerts: true,
      emailNotifications: true,
      smsNotifications: false
    },
    security: {
      sessionTimeout: 30,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true
      },
      twoFactorAuth: false,
      auditLogging: true,
      encryptionLevel: 'high'
    },
    integrations: {
      supabaseConfig: {
        url: 'https://your-project.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      },
      apiEndpoints: {
        weatherService: 'https://api.weatherapi.com/v1',
        carbonTracker: 'https://api.carbontracker.org',
        priceTracker: 'https://api.energymarket.com'
      },
      enableWebhooks: false,
      webhookUrl: ''
    },
    performance: {
      cacheSize: 128,
      maxConcurrentUsers: 100,
      dataCompression: true,
      enableCDN: false,
      autoBackup: true,
      backupFrequency: 'daily'
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'monitoring', label: 'Monitoring', icon: Monitor },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Wifi },
    { id: 'performance', label: 'Performance', icon: Database }
  ];

  const updateSettings = (section: keyof SystemSettings, key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const updateNestedSettings = (section: keyof SystemSettings, nestedKey: string, key: string, value: string | number | boolean) => {
    setSettings(prev => {
      // Type-safe update for nested settings
      const currentSection = { ...prev[section] };
      const currentNested = { ...(currentSection as unknown as Record<string, Record<string, unknown>>)[nestedKey] };
      currentNested[key] = value;
      (currentSection as unknown as Record<string, Record<string, unknown>>)[nestedKey] = currentNested;
      
      return {
        ...prev,
        [section]: currentSection
      };
    });
    setUnsavedChanges(true);
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would save to your backend
      localStorage.setItem('systemSettings', JSON.stringify(settings));
      
      setUnsavedChanges(false);
      notificationService.success('Settings saved successfully!');
    } catch {
      notificationService.error('Failed to save settings', 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset logic would go here
      notificationService.info('Settings reset to defaults');
      setUnsavedChanges(true);
    }
  };

  const testConnection = async (service: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      notificationService.success(`${service} connection test successful!`);
    } catch {
      notificationService.error(`${service} connection failed`, 'Please check your configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600 mt-2">
                Configure your hydrogen ecosystem platform
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {unsavedChanges && (
                <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Unsaved changes</span>
                </div>
              )}
              <button
                onClick={resetToDefaults}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={saveSettings}
                disabled={loading || !unsavedChanges}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">General Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    System Name
                  </label>
                  <input
                    type="text"
                    value={settings.general.systemName}
                    onChange={(e) => updateSettings('general', 'systemName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Berlin">Berlin</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => updateSettings('general', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={settings.general.theme}
                    onChange={(e) => updateSettings('general', 'theme', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Monitoring Settings */}
          {activeTab === 'monitoring' && (
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Monitoring Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refresh Interval (ms)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    max="60000"
                    step="1000"
                    value={settings.monitoring.refreshInterval}
                    onChange={(e) => updateSettings('monitoring', 'refreshInterval', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Retention Period (days)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="365"
                    value={settings.monitoring.retentionPeriod}
                    onChange={(e) => updateSettings('monitoring', 'retentionPeriod', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Alert Thresholds</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      value={settings.monitoring.alertThresholds.temperature}
                      onChange={(e) => updateNestedSettings('monitoring', 'alertThresholds', 'temperature', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pressure (bar)
                    </label>
                    <input
                      type="number"
                      value={settings.monitoring.alertThresholds.pressure}
                      onChange={(e) => updateNestedSettings('monitoring', 'alertThresholds', 'pressure', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Efficiency (%)
                    </label>
                    <input
                      type="number"
                      value={settings.monitoring.alertThresholds.efficiency}
                      onChange={(e) => updateNestedSettings('monitoring', 'alertThresholds', 'efficiency', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Notification Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.monitoring.enableRealTimeAlerts}
                      onChange={(e) => updateSettings('monitoring', 'enableRealTimeAlerts', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable real-time alerts</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.monitoring.emailNotifications}
                      onChange={(e) => updateSettings('monitoring', 'emailNotifications', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.monitoring.smsNotifications}
                      onChange={(e) => updateSettings('monitoring', 'smsNotifications', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Encryption Level
                  </label>
                  <select
                    value={settings.security.encryptionLevel}
                    onChange={(e) => updateSettings('security', 'encryptionLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="standard">Standard (AES-128)</option>
                    <option value="high">High (AES-256)</option>
                    <option value="maximum">Maximum (AES-256 + RSA)</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Password Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Length
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="32"
                      value={settings.security.passwordPolicy.minLength}
                      onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.passwordPolicy.requireUppercase}
                        onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'requireUppercase', e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Require uppercase letters</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.passwordPolicy.requireNumbers}
                        onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'requireNumbers', e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Require numbers</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.passwordPolicy.requireSpecialChars}
                        onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'requireSpecialChars', e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Require special characters</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Security Features</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => updateSettings('security', 'twoFactorAuth', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Audit Logging</span>
                    <input
                      type="checkbox"
                      checked={settings.security.auditLogging}
                      onChange={(e) => updateSettings('security', 'auditLogging', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Settings */}
          {activeTab === 'integrations' && (
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Integration Settings</h2>
                <button
                  onClick={() => setShowApiKeys(!showApiKeys)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showApiKeys ? 'Hide' : 'Show'} API Keys</span>
                </button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Supabase Configuration</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supabase URL
                    </label>
                    <input
                      type="url"
                      value={settings.integrations.supabaseConfig.url}
                      onChange={(e) => updateNestedSettings('integrations', 'supabaseConfig', 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKeys ? "text" : "password"}
                        value={settings.integrations.supabaseConfig.key}
                        onChange={(e) => updateNestedSettings('integrations', 'supabaseConfig', 'key', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => testConnection('Supabase')}
                    className="w-fit flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Test Connection</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">External API Endpoints</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weather Service API
                    </label>
                    <input
                      type="url"
                      value={settings.integrations.apiEndpoints.weatherService}
                      onChange={(e) => updateNestedSettings('integrations', 'apiEndpoints', 'weatherService', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carbon Tracker API
                    </label>
                    <input
                      type="url"
                      value={settings.integrations.apiEndpoints.carbonTracker}
                      onChange={(e) => updateNestedSettings('integrations', 'apiEndpoints', 'carbonTracker', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Energy Price API
                    </label>
                    <input
                      type="url"
                      value={settings.integrations.apiEndpoints.priceTracker}
                      onChange={(e) => updateNestedSettings('integrations', 'apiEndpoints', 'priceTracker', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Webhooks</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.integrations.enableWebhooks}
                      onChange={(e) => updateSettings('integrations', 'enableWebhooks', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable webhooks</span>
                  </label>
                  {settings.integrations.enableWebhooks && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook URL
                      </label>
                      <input
                        type="url"
                        value={settings.integrations.webhookUrl}
                        onChange={(e) => updateSettings('integrations', 'webhookUrl', e.target.value)}
                        placeholder="https://your-app.com/webhooks/hydrogen-data"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Performance Settings */}
          {activeTab === 'performance' && (
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cache Size (MB)
                  </label>
                  <input
                    type="number"
                    min="64"
                    max="1024"
                    step="64"
                    value={settings.performance.cacheSize}
                    onChange={(e) => updateSettings('performance', 'cacheSize', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Concurrent Users
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={settings.performance.maxConcurrentUsers}
                    onChange={(e) => updateSettings('performance', 'maxConcurrentUsers', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Optimization Features</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Data Compression</span>
                    <input
                      type="checkbox"
                      checked={settings.performance.dataCompression}
                      onChange={(e) => updateSettings('performance', 'dataCompression', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Enable CDN</span>
                    <input
                      type="checkbox"
                      checked={settings.performance.enableCDN}
                      onChange={(e) => updateSettings('performance', 'enableCDN', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Auto Backup</span>
                    <input
                      type="checkbox"
                      checked={settings.performance.autoBackup}
                      onChange={(e) => updateSettings('performance', 'autoBackup', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </label>
                </div>
              </div>

              {settings.performance.autoBackup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.performance.backupFrequency}
                    onChange={(e) => updateSettings('performance', 'backupFrequency', e.target.value)}
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSettings;