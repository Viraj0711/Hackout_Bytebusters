import { useState } from 'react';
import { 
  Users, 
  Database, 
  Settings, 
  CheckCircle,
  Activity,
  Server,
  HardDrive,
  Cpu,
  BarChart3,
  Download,
  UserPlus,
  Trash2,
  Edit,
  Search
} from 'lucide-react';

const SafeAdmin = () => {
  const [activeTab, setActiveTab] = useState('users');

  // Mock data
  const mockUsers = [
    {
      id: '1',
      email: 'john.doe@example.com',
      full_name: 'John Doe',
      organization: 'Green Energy Corp',
      role: 'analyst',
      created_at: '2024-01-15T10:30:00Z',
      last_sign_in: '2024-01-20T09:15:00Z',
      status: 'active'
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      full_name: 'Jane Smith',
      organization: 'Hydrogen Solutions Ltd',
      role: 'planner',
      created_at: '2024-01-10T14:20:00Z',
      last_sign_in: '2024-01-19T16:45:00Z',
      status: 'active'
    },
    {
      id: '3',
      email: 'mike.wilson@example.com',
      full_name: 'Mike Wilson',
      organization: 'Clean Tech Industries',
      role: 'energy_company',
      created_at: '2024-01-05T11:10:00Z',
      last_sign_in: '2024-01-18T13:30:00Z',
      status: 'inactive'
    }
  ];

  const mockSystemStats = {
    totalUsers: 156,
    activeUsers: 142,
    totalAssets: 1247,
    systemUptime: '99.9%',
    avgResponseTime: '245ms',
    dailyActiveUsers: 89,
    storageUsed: '2.4TB',
    apiCalls: 15420
  };

  const tabs = [
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'system', name: 'System Health', icon: Server },
    { id: 'settings', name: 'System Settings', icon: Settings }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'planner': return 'bg-blue-100 text-blue-800';
      case 'analyst': return 'bg-green-100 text-green-800';
      case 'energy_company': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'text-green-600' 
      : 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage users, monitor system health, and configure application settings
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{mockSystemStats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{mockSystemStats.activeUsers}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{mockSystemStats.systemUptime}</p>
              </div>
              <Server className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Calls Today</p>
                <p className="text-2xl font-bold text-gray-900">{mockSystemStats.apiCalls.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                      <div className="flex space-x-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add User
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Organization</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Active</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockUsers.map((user) => (
                            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div>
                                  <div className="font-medium text-gray-900">{user.full_name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-900">{user.organization}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className={`w-2 h-2 rounded-full mr-2 ${user.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                  <span className={`text-sm ${getStatusColor(user.status)}`}>{user.status}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-500">
                                {new Date(user.last_sign_in).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button className="text-red-600 hover:text-red-800">
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

              {/* System Health Tab */}
              {activeTab === 'system' && (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-green-50 rounded-lg p-6">
                        <div className="flex items-center">
                          <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                          <div>
                            <h4 className="text-lg font-semibold text-green-900">System Status</h4>
                            <p className="text-green-600">All systems operational</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-6">
                        <div className="flex items-center">
                          <Activity className="w-8 h-8 text-blue-500 mr-3" />
                          <div>
                            <h4 className="text-lg font-semibold text-blue-900">Performance</h4>
                            <p className="text-blue-600">Avg response: {mockSystemStats.avgResponseTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">CPU Usage</h4>
                          <Cpu className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-2">45%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">Memory Usage</h4>
                          <Database className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-2">67%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">Storage</h4>
                          <HardDrive className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-2">{mockSystemStats.storageUsed}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Authentication Settings</h4>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Require email verification</span>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </label>
                          <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Enable two-factor authentication</span>
                            <input type="checkbox" className="rounded" />
                          </label>
                          <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Auto-logout inactive users</span>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </label>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Data Management</h4>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Enable data backup</span>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </label>
                          <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Auto-archive old data</span>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </label>
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">Data retention period (days)</label>
                            <input type="number" defaultValue="365" className="border border-gray-300 rounded px-3 py-2 w-32" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeAdmin;