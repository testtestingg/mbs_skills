import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  MessageSquare,
  Globe,
  TrendingUp,
  Calendar,
  Clock,
  Mail,
  Phone,
  Monitor,
  Smartphone,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  LogOut,
  Shield,
  Activity,
  PieChart,
  Filter,
  Search,
  Trash2,
  CheckCircle,
  Clock as ClockIcon
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Import Chart.js and required components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  language: string;
  status: string;
  created_at: string;
}

interface PageView {
  id: string;
  page: string;
  language: string;
  referrer?: string;
  user_agent?: string;
  created_at: string;
}

interface DailyStat {
  id: number;
  date: string;
  page_views: number;
  contact_submissions: number;
  successful_submissions: number;
  created_at: string;
}

interface BrowserStat {
  browser: string;
  total_count: number;
  days_active: number;
}

interface UserInteraction {
  id: string;
  interaction_type: string;
  page: string;
  language: string;
  metadata: any;
  created_at: string;
}

interface Stats {
  totalPageViews: number;
  totalContactSubmissions: number;
  successfulSubmissions: number;
  pageViewsToday: number;
  pageViewsThisWeek: number;
  pageViewsThisMonth: number;
  submissionsToday: number;
  submissionsThisWeek: number;
  submissionsThisMonth: number;
  languageStats: { language: string; pageViews: number }[];
  serviceStats: { service: string; count: number }[];
  browserStats: { browser: string; count: number }[];
  recentPageViews: PageView[];
  recentSubmissions: Contact[];
  userInteractions?: UserInteraction[];
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [browserStats, setBrowserStats] = useState<BrowserStat[]>([]);
  const [userInteractions, setUserInteractions] = useState<UserInteraction[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch contacts from Supabase
  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Contact[];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  };

  // Fetch daily stats from Supabase
  const fetchDailyStats = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_stats')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data as DailyStat[];
    } catch (error) {
      console.error('Error fetching daily stats:', error);
      return [];
    }
  };

  // Delete a contact
  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setContacts(prev => prev.filter(contact => contact.id !== id));
      await loadStats();
      
      alert('Contact deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact');
    }
  };

  // Update contact status
  const updateContactStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setContacts(prev => 
        prev.map(contact => 
          contact.id === id ? { ...contact, status: newStatus } : contact
        )
      );
      
      await loadStats();
      alert(`Contact status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating contact status:', error);
      alert('Failed to update contact status');
    }
  };

  // Fetch page views from Supabase
  const fetchPageViews = async () => {
    try {
      // First get the total count
      const { count: totalCount, error: countError } = await supabase
        .from('simple_page_views')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error counting page views:', countError);
        return { views: [], total: 0 };
      }
      
      // Then get the recent views for display
      const { data, error } = await supabase
        .from('simple_page_views')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('Error fetching page views:', error);
        return { views: [], total: totalCount || 0 };
      }
      
      return {
        views: (data || []).map(item => ({
          id: item.id,
          page: item.page,
          language: item.language,
          referrer: null,
          user_agent: null,
          created_at: item.created_at
        })),
        total: totalCount || 0
      };
    } catch (error) {
      console.error('Error fetching page views:', error);
      return { views: [], total: 0 };
    }
  };

  // Fetch browser stats from Supabase
  const fetchBrowserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('browser_stats_view')
        .select('*');
      
      if (error) throw error;
      return data as BrowserStat[];
    } catch (error) {
      console.error('Error fetching browser stats:', error);
      return [];
    }
  };

  // Fetch user interactions from Supabase
  const fetchUserInteractions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_interactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as UserInteraction[];
    } catch (error) {
      console.error('Error fetching user interactions:', error);
      return [];
    }
  };

  // Fetch page view stats
  const fetchPageViewStats = async () => {
    try {
      const { data, error } = await supabase
        .from('page_view_stats')
        .select('*')
        .order('day', { ascending: false })
        .limit(30);
      
      if (error) {
        console.error('Error fetching page view stats:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching page view stats:', error);
      return [];
    }
  };

  // Fetch page popularity
  const fetchPagePopularity = async () => {
    try {
      const { data, error } = await supabase
        .from('page_popularity')
        .select('*')
        .order('views', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching page popularity:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching page popularity:', error);
      return [];
    }
  };
  
  // Fetch language distribution
  const fetchLanguageDistribution = async () => {
    try {
      const { data, error } = await supabase
        .from('language_distribution')
        .select('*')
        .order('views', { ascending: false });
    
      if (error) {
        console.error('Error fetching language distribution:', error);
        return [];
      }
    
      return data || [];
    } catch (error) {
      console.error('Error fetching language distribution:', error);
      return [];
    }
  };

  // Load all statistics
  const loadStats = async () => {
    setIsLoading(true);
    try {
      const [contactsData, pageViewsData, dailyStatsData, browserStatsData, userInteractionsData, languageDistribution] = await Promise.all([
        fetchContacts(),
        fetchPageViews(),
        fetchDailyStats(),
        fetchBrowserStats(),
        fetchUserInteractions(),
        fetchLanguageDistribution()
      ]);
      
      setContacts(contactsData);
      setDailyStats(dailyStatsData);
      setBrowserStats(browserStatsData);
      setUserInteractions(userInteractionsData);
      
      // Calculate statistics
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const monthStart = new Date(today.getFullYear(), now.getMonth(), 1);

      // Calculate page view statistics
      const totalPageViews = pageViewsData.total;
      let pageViewsToday = 0;
      let pageViewsThisWeek = 0;
      let pageViewsThisMonth = 0;

      pageViewsData.views.forEach(view => {
        const viewDate = new Date(view.created_at);
        
        if (viewDate >= today) {
          pageViewsToday++;
        }
        
        if (viewDate >= weekStart) {
          pageViewsThisWeek++;
        }
        
        if (viewDate >= monthStart) {
          pageViewsThisMonth++;
        }
      });

      // Calculate contact statistics
      let totalContactSubmissions = contactsData.length;
      let successfulSubmissions = contactsData.filter(c => c.status === 'completed').length;
      let submissionsToday = 0;
      let submissionsThisWeek = 0;
      let submissionsThisMonth = 0;

      contactsData.forEach(contact => {
        const contactDate = new Date(contact.created_at);
        
        if (contactDate >= today) {
          submissionsToday++;
        }
        
        if (contactDate >= weekStart) {
          submissionsThisWeek++;
        }
        
        if (contactDate >= monthStart) {
          submissionsThisMonth++;
        }
      });

      // Format language stats
      const languageStatsArray = languageDistribution.map(item => ({
        language: item.language,
        pageViews: item.views
      }));

      // Calculate service stats from contacts data
      const serviceStats: Record<string, number> = {};
      contactsData.forEach(contact => {
        serviceStats[contact.service] = (serviceStats[contact.service] || 0) + 1;
      });

      const serviceStatsArray = Object.entries(serviceStats).map(([service, count]) => ({
        service,
        count
      }));

      // Format browser stats
      const browserStatsArray = browserStatsData.map(item => ({
        browser: item.browser,
        count: item.total_count
      }));

      setStats({
        totalPageViews,
        totalContactSubmissions,
        successfulSubmissions,
        pageViewsToday,
        pageViewsThisWeek,
        pageViewsThisMonth,
        submissionsToday,
        submissionsThisWeek,
        submissionsThisMonth,
        languageStats: languageStatsArray,
        serviceStats: serviceStatsArray,
        browserStats: browserStatsArray,
        recentPageViews: pageViewsData.views.slice(0, 10),
        recentSubmissions: contactsData.slice(0, 10),
        userInteractions: userInteractionsData
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const exportData = () => {
    const data = {
      statistics: stats,
      contacts: contacts,
      dailyStats: dailyStats,
      browserStats: browserStats,
      userInteractions: userInteractions,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techytak-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter contacts based on search and period
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const contactDate = new Date(contact.created_at);
    
    let matchesPeriod = true;
    if (filterPeriod === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      matchesPeriod = contactDate >= today;
    } else if (filterPeriod === 'week') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      matchesPeriod = contactDate >= weekStart;
    } else if (filterPeriod === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      matchesPeriod = contactDate >= monthStart;
    }
    
    return matchesSearch && matchesPeriod;
  });

  // Chart data and options
  const getLanguageChartData = () => {
    if (!stats) return { labels: [], datasets: [] };
    
    return {
      labels: stats.languageStats.map(lang => 
        lang.language === 'ar' ? 'Arabic' : 
        lang.language === 'fr' ? 'French' : 'English'
      ),
      datasets: [
        {
          label: 'Page Views',
          data: stats.languageStats.map(lang => lang.pageViews),
          backgroundColor: [
            'rgba(139, 92, 246, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
          ],
          borderColor: [
            'rgba(139, 92, 246, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const getDailyViewsChartData = () => {
    if (!stats || dailyStats.length === 0) return { labels: [], datasets: [] };
    
    // Sort by date ascending for the chart
    const sortedStats = [...dailyStats].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return {
      labels: sortedStats.map(stat => 
        new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      datasets: [
        {
          label: 'Page Views',
          data: sortedStats.map(stat => stat.page_views),
          borderColor: 'rgba(139, 92, 246, 1)',
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          tension: 0.3,
          fill: true,
        },
        {
          label: 'Contact Submissions',
          data: sortedStats.map(stat => stat.contact_submissions),
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  const getServiceChartData = () => {
    if (!stats) return { labels: [], datasets: [] };
    
    return {
      labels: stats.serviceStats.map(service => 
        service.service === 'website' ? 'Websites' : 
        service.service === 'mobile' ? 'Mobile Apps' : 'Custom Solutions'
      ),
      datasets: [
        {
          label: 'Requests',
          data: stats.serviceStats.map(service => service.count),
          backgroundColor: [
            'rgba(239, 68, 68, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(16, 185, 129, 0.7)',
          ],
          borderColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(16, 185, 129, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(139, 92, 246, 0.5)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 10
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 10
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(139, 92, 246, 0.5)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'violet', change = 0 }: { 
    title: string; 
    value: string; 
    icon: React.ElementType; 
    color?: string;
    change?: number;
  }) => (
    <motion.div
      className={`bg-gradient-to-br from-black to-${color}-900/20 border border-${color}-500/30 rounded-xl p-6 hover:border-${color}-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-${color}-500/10`}
      whileHover={{ scale: 1.03, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change !== 0 && (
            <div className={`flex items-center mt-1 ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span>{change > 0 ? '↑' : '↓'}</span>
              <span className="text-xs ml-1">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-${color}-500/20 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-400`} />
        </div>
      </div>
    </motion.div>
  );

  const getHostname = (url: string) => {
    try {
      if (!url || url.trim() === '') return 'Direct';
      return new URL(url).hostname;
    } catch (error) {
      return 'Direct';
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-600/20 text-yellow-300' },
    { value: 'contacted', label: 'Contacted', color: 'bg-blue-600/20 text-blue-300' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-purple-600/20 text-purple-300' },
    { value: 'completed', label: 'Completed', color: 'bg-green-600/20 text-green-300' },
    { value: 'not-interested', label: 'Not Interested', color: 'bg-red-600/20 text-red-300' }
  ];

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-white text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading dashboard...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-violet-500/20 bg-gradient-to-r from-black to-violet-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-violet-400" />
              <h1 className="text-xl font-bold">TechyTak Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadStats}
                className="p-2 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                onClick={exportData}
                className="p-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 transition-colors"
                title="Export Data"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-violet-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'contacts', label: 'Contact Submissions', icon: MessageSquare },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'users', label: 'User Activity', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Page Views"
                value={stats.totalPageViews.toLocaleString()}
                icon={Eye}
                color="blue"
                change={12}
              />
              <StatCard
                title="Contact Submissions"
                value={stats.totalContactSubmissions.toLocaleString()}
                icon={MessageSquare}
                color="green"
                change={8}
              />
              <StatCard
                title="Success Rate"
                value={`${Math.round((stats.successfulSubmissions / Math.max(stats.totalContactSubmissions, 1)) * 100)}%`}
                icon={TrendingUp}
                color="violet"
                change={5}
              />
              <StatCard
                title="Active Today"
                value={stats.pageViewsToday.toLocaleString()}
                icon={Activity}
                color="orange"
                change={3}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Activity Chart */}
              <div className="bg-gradient-to-br from-black to-violet-900/20 border border-violet-500/30 rounded-xl p-6 h-80">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-violet-400" />
                  Daily Activity Trends
                </h3>
                <div className="h-64">
                  <Line data={getDailyViewsChartData()} options={chartOptions} />
                </div>
              </div>

              {/* Language Distribution Chart */}
              <div className="bg-gradient-to-br from-black to-violet-900/20 border border-violet-500/30 rounded-xl p-6 h-80">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-violet-400" />
                  Language Distribution
                </h3>
                <div className="h-64">
                  <Pie data={getLanguageChartData()} options={pieChartOptions} />
                </div>
              </div>
            </div>

            {/* Service Requests Chart */}
            <div className="bg-gradient-to-br from-black to-violet-900/20 border border-violet-500/30 rounded-xl p-6 h-80">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-violet-400" />
                Service Requests
              </h3>
              <div className="h-64">
                <Bar data={getServiceChartData()} options={chartOptions} />
              </div>
            </div>

            {/* Time-based Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-black to-violet-900/20 border border-violet-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-violet-400" />
                  Daily Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Page Views</span>
                    <span className="text-white font-medium">{stats.pageViewsToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Submissions</span>
                    <span className="text-white font-medium">{stats.submissionsToday}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-black to-green-900/20 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-400" />
                  Weekly Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Page Views</span>
                    <span className="text-white font-medium">{stats.pageViewsThisWeek}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Submissions</span>
                    <span className="text-white font-medium">{stats.submissionsThisWeek}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-black to-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                  Monthly Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Page Views</span>
                    <span className="text-white font-medium">{stats.pageViewsThisMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Submissions</span>
                    <span className="text-white font-medium">{stats.submissionsThisMonth}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/50 border border-violet-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-4 py-2 bg-black/50 border border-violet-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Contact Submissions Table */}
            <div className="bg-gradient-to-br from-black to-violet-900/20 border border-violet-500/30 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-violet-500/20">
                <h3 className="text-lg font-semibold">Contact Submissions ({filteredContacts.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-violet-900/20">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-violet-500/20">
                    {filteredContacts.map((submission) => (
                      <tr key={submission.id} className="hover:bg-violet-900/10">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">{submission.name}</div>
                            <div className="text-sm text-gray-400 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {submission.email}
                            </div>
                            {submission.phone && (
                              <div className="text-sm text-gray-400 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {submission.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-violet-600/20 text-violet-300 rounded-full">
                            {submission.service === 'website' ? 'Websites' : 
                             submission.service === 'mobile' ? 'Mobile Apps' : 'Custom Solutions'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            submission.status === 'completed' ? 'bg-green-600/20 text-green-300' : 
                            submission.status === 'contacted' ? 'bg-blue-600/20 text-blue-300' :
                            submission.status === 'in-progress' ? 'bg-purple-600/20 text-purple-300' :
                            submission.status === 'not-interested' ? 'bg-red-600/20 text-red-300' :
                            'bg-yellow-600/20 text-yellow-300'
                          }`}>
                            {submission.status === 'pending' ? 'Pending' : 
                             submission.status === 'contacted' ? 'Contacted' :
                             submission.status === 'in-progress' ? 'In Progress' :
                             submission.status === 'completed' ? 'Completed' :
                             submission.status === 'not-interested' ? 'Not Interested' : submission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          <div>{formatDate(submission.created_at)}</div>
                          <div className="text-xs">{formatRelativeTime(submission.created_at)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-300 max-w-xs truncate" title={submission.message}>
                            {submission.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <select
                              value={submission.status}
                              onChange={(e) => updateContactStatus(submission.id, e.target.value)}
                              className="bg-black/50 border border-violet-500/30 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                            >
                              {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => deleteContact(submission.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Delete contact"
                            >
                              <Trash2 className="h-4 w-4" />
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

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Browser Stats */}
            <div className="bg-gradient-to-br from-black to-blue-900/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Monitor className="h-5 w-5 mr-2 text-blue-400" />
                Browser Distribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.browserStats.map((browser) => (
                  <div key={browser.browser} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                    <span className="text-gray-300">{browser.browser}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{browser.count}</span>
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(browser.count / Math.max(stats.totalPageViews, 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Page Views */}
            <div className="bg-gradient-to-br from-black to-green-900/20 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-green-400" />
                Recent Page Views
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {stats.recentPageViews.map((view) => (
                  <div key={view.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <span className="text-white font-medium">{view.page}</span>
                        <div className="text-sm text-gray-400">
                          {view.language.toUpperCase()} • {formatRelativeTime(view.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {getHostname(view.referrer || '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-black to-violet-900/20 border border-violet-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-violet-400" />
                User Interactions
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {userInteractions.length > 0 ? (
                  userInteractions.map((interaction) => (
                    <div key={interaction.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                        <div>
                          <span className="text-white font-medium">{interaction.interaction_type}</span>
                          <div className="text-sm text-gray-400">
                            {interaction.page} • {interaction.language.toUpperCase()} • {formatRelativeTime(interaction.created_at)}
                          </div>
                          {interaction.metadata && (
                            <div className="text-xs text-gray-500 mt-1">
                              {JSON.stringify(interaction.metadata)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No user interactions recorded yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-violet-500/20 text-center text-gray-500 text-sm">
        <p>TechyTak Admin Dashboard • {new Date().getFullYear()}</p>
        <p className="mt-1">Data refreshes every 30 seconds</p>
      </div>
    </div>
  );
};

export default AdminDashboard;