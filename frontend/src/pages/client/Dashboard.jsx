import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await authApi.clientDashboard();
        setDashboard(response ?? {});
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-white text-lg mr-3">
                GG
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Client Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.607 1.023L15.03 9.03l-3.108.526A5.972 5.972 0 009.345 7.018l.622 637L15 17a5 5 0 00-5 5z" />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Welcome Back!</h2>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">{user?.full_name || 'Client'}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Member Since</span>
                  <span className="text-sm font-medium">January 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Available Features</span>
                  <span className="text-sm font-medium">{dashboard?.features?.length ?? 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                  <div className="w-8 h-8 bg-amber-500 rounded-lg mx-auto mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Browse Artisans</p>
                </button>
                <button className="p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                  <div className="w-8 h-8 bg-amber-500 rounded-lg mx-auto mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Create Booking</p>
                </button>
                <button className="p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                  <div className="w-8 h-8 bg-amber-500 rounded-lg mx-auto mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">My Bookings</p>
                </button>
                <button className="p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                  <div className="w-8 h-8 bg-amber-500 rounded-lg mx-auto mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Payments</p>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Dashboard</h2>
              {dashboard?.features?.length > 0 ? (
                <div className="grid gap-3">
                  {dashboard.features.map((feature) => (
                    <div key={feature} className="rounded-xl border border-gray-200 p-4 bg-slate-50">
                      <p className="text-sm text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500 mb-4">Your client dashboard is loading features.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
