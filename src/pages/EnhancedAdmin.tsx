import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  Settings, 
  Database, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Server, 
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { LoadingSpinner } from '../components/Layout/LoadingSpinner';
import { notificationService } from '../services/notificationService';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
}

interface SystemMetric {
  id: string;
  name: string;
  value: string;
  change: number;
  status: 'good' | 'warning' | 'error';
  unit: string;
}

interface AuditLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

const EnhancedAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'system' | 'audit' | 'backup'>('overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Admin',
      email: 'john@hydrogen.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15 14:30:00',
      permissions: ['read', 'write', 'delete', 'admin']
    },
    {
      id: '2',
      name: 'Sarah Operator',
      email: 'sarah@hydrogen.com',
      role: 'operator',
      status: 'active',
      lastLogin: '2024-01-15 13:15:00',
      permissions: ['read', 'write']
    },
    {
      id: '3',
      name: 'Mike Viewer',
      email: 'mike@hydrogen.com',
      role: 'viewer',
      status: 'inactive',
      lastLogin: '2024-01-12 09:45:00',
      permissions: ['read']
    },
    {
      id: '4',
      name: 'Emma Tech',
      email: 'emma@hydrogen.com',
      role: 'operator',
      status: 'suspended',
      lastLogin: '2024-01-10 16:20:00',
      permissions: ['read', 'write']
    }
  ]);

  const [systemMetrics] = useState<SystemMetric[]>([
    { id: '1', name: 'CPU Usage', value: '45', change: -5, status: 'good', unit: '%' },
    { id: '2', name: 'Memory Usage', value: '62', change: 8, status: 'warning', unit: '%' },
    { id: '3', name: 'Storage Usage', value: '78', change: 12, status: 'warning', unit: '%' },
    { id: '4', name: 'Network I/O', value: '125', change: 23, status: 'good', unit: 'MB/s' },
    { id: '5', name: 'Active Sessions', value: '24', change: 3, status: 'good', unit: '' },
    { id: '6', name: 'Database Size', value: '2.4', change: 0.2, status: 'good', unit: 'GB' },
    { id: '7', name: 'API Requests', value: '1,234', change: 156, status: 'good', unit: '/hour' },
    { id: '8', name: 'Error Rate', value: '0.02', change: -0.01, status: 'good', unit: '%' }
  ]);

  const [auditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      user: 'John Admin',
      action: 'User Created',
      timestamp: '2024-01-15 14:35:00',
      details: 'Created new user account for emma@hydrogen.com',
      severity: 'medium'
    },
    {
      id: '2',
      user: 'Sarah Operator',
      action: 'Asset Updated',
      timestamp: '2024-01-15 14:20:00',
      details: 'Updated hydrogen station H2-001 configuration',
      severity: 'low'
    },
    {
      id: '3',
      user: 'System',
      action: 'Backup Completed',
      timestamp: '2024-01-15 03:00:00',
      details: 'Automated database backup completed successfully',
      severity: 'low'
    },
    {
      id: '4',
      user: 'John Admin',
      action: 'Security Alert',
      timestamp: '2024-01-15 02:15:00',
      details: 'Multiple failed login attempts detected from IP 192.168.1.100',
      severity: 'high'
    },
    {
      id: '5',
      user: 'Sarah Operator',
      action: 'Settings Changed',
      timestamp: '2024-01-14 16:45:00',
      details: 'Updated monitoring thresholds for temperature alerts',
      severity: 'medium'
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'system', label: 'System', icon: Server },
    { id: 'audit', label: 'Audit Logs', icon: Shield },
    { id: 'backup', label: 'Backup', icon: Database }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const createBackup = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      notificationService.success('Backup created successfully', 'Database backup completed');
    } catch {
      notificationService.error('Backup failed', 'Please check system logs');
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async () => {
    if (window.confirm('Are you sure you want to restore from backup? This will overwrite current data.')) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        notificationService.success('Database restored successfully');
      } catch {
        notificationService.error('Restore failed', 'Please contact support');
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      notificationService.success('User deleted successfully');
    }
  };

  const toggleUserStatus = (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    notificationService.success(`User status updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      case 'suspended': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Administration</h1>
          <p className="text-gray-600">Manage users, monitor system health, and maintain platform security</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mt-2">
                  <span className="text-green-600 text-sm">
                    {users.filter(u => u.status === 'active').length} active
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">System Health</p>
                    <p className="text-2xl font-bold text-green-600">Good</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-2">
                  <span className="text-green-600 text-sm">All systems operational</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Alerts</p>
                    <p className="text-2xl font-bold text-yellow-600">3</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="mt-2">
                  <span className="text-yellow-600 text-sm">2 warnings, 1 info</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Database Size</p>
                    <p className="text-2xl font-bold text-gray-900">2.4 GB</p>
                  </div>
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mt-2">
                  <span className="text-green-600 text-sm">+0.2 GB this week</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(log.severity)}`}>
                            {log.severity.toUpperCase()}
                          </span>
                          <span className="font-medium text-gray-900">{log.action}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                        <p className="text-xs text-gray-500 mt-1">by {log.user} at {log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Management Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="operator">Operator</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <button
                onClick={() => notificationService.info('User creation modal would open here')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.lastLogin}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => notificationService.info(`Edit user: ${user.name}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
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
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">System Metrics</h2>
            
            {/* System Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemMetrics.map((metric) => (
                <div key={metric.id} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{metric.name}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metric.value}{metric.unit}
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                      {metric.status === 'good' ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : metric.status === 'warning' ? (
                        <AlertTriangle className="w-6 h-6" />
                      ) : (
                        <TrendingUp className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className={`text-sm ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change >= 0 ? '+' : ''}{metric.change}{metric.unit}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last hour</span>
                  </div>
                </div>
              ))}
            </div>

            {/* System Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Server className="w-5 h-5 text-gray-600" />
                  <span>Restart Services</span>
                </button>
                <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Database className="w-5 h-5 text-gray-600" />
                  <span>Optimize Database</span>
                </button>
                <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span>Clear Cache</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Audit Logs</h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>All Severity</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{log.timestamp}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.user}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{log.action}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
                            {log.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Backup Tab */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Backup & Recovery</h2>
            
            {/* Backup Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Backup</h3>
                <p className="text-gray-600 mb-4">Create a complete backup of your system data and configuration.</p>
                <button
                  onClick={createBackup}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? <LoadingSpinner size="sm" /> : <Download className="w-4 h-4" />}
                  <span>Create Backup</span>
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Restore from Backup</h3>
                <p className="text-gray-600 mb-4">Restore your system from a previously created backup file.</p>
                <button
                  onClick={restoreBackup}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  {loading ? <LoadingSpinner size="sm" /> : <Upload className="w-4 h-4" />}
                  <span>Restore Backup</span>
                </button>
              </div>
            </div>

            {/* Backup History */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Backup History</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { id: '1', date: '2024-01-15 03:00:00', size: '2.4 GB', status: 'completed' },
                    { id: '2', date: '2024-01-14 03:00:00', size: '2.3 GB', status: 'completed' },
                    { id: '3', date: '2024-01-13 03:00:00', size: '2.2 GB', status: 'completed' },
                    { id: '4', date: '2024-01-12 03:00:00', size: '2.1 GB', status: 'failed' }
                  ].map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <div className="font-medium text-gray-900">{backup.date}</div>
                        <div className="text-sm text-gray-600">Size: {backup.size}</div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          backup.status === 'completed' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                        }`}>
                          {backup.status}
                        </span>
                        {backup.status === 'completed' && (
                          <button className="text-blue-600 hover:text-blue-900 text-sm">
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAdmin;