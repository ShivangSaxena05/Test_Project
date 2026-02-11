'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, FileText, Languages, CheckCircle, Clock, TrendingUp, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = async () => {
    try {
      const baseURL = typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.NEXT_PUBLIC_API_URL || '';

      const response = await fetch(`${baseURL}/api/admin/dashboard/stats`);
      const data = await response.json();

      if (data.stats) {
        setStats(data.stats);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-green-700 text-lg font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-50">
        <p className="text-red-500 text-lg">Failed to load dashboard statistics.</p>
        <button 
          onClick={fetchStats}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      subtitle: `${stats.users.candidates} Candidates, ${stats.users.qa} QA`
    },
    {
      title: 'New Users (7 days)',
      value: stats.users.newUsersThisWeek,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      subtitle: 'Growth indicator'
    },
    {
      title: 'Total Tasks',
      value: stats.tasks.total,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      subtitle: 'All translation tasks'
    },
    {
      title: 'Languages',
      value: stats.content.languages,
      icon: Languages,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      subtitle: 'Supported languages'
    },
    {
      title: 'Sentences',
      value: stats.content.sentences,
      icon: CheckCircle,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      subtitle: 'Total sentences in system'
    },
    {
      title: 'Under Review',
      value: stats.tasks.underQA,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      subtitle: 'Awaiting QA review'
    }
  ];

  const taskStatusData = [
    { name: 'Under Candidate', value: stats.tasks.underCandidate, color: '#3B82F6' },
    { name: 'Under QA', value: stats.tasks.underQA, color: '#EAB308' },
    { name: 'Completed', value: stats.tasks.completed, color: '#22C55E' }
  ];

  // Calculate percentages for progress bars
  const totalTasks = stats.tasks.total || 1; // Avoid division by zero
  const candidateProgress = (stats.tasks.underCandidate / totalTasks) * 100;
  const qaProgress = (stats.tasks.underQA / totalTasks) * 100;
  const completedProgress = (stats.tasks.completed / totalTasks) * 100;

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-green-800">Analytics Dashboard</h1>
        <p className="text-green-600 mt-1">
          Real-time overview of your translation platform
        </p>
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${card.bgColor} rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color} bg-opacity-20`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
              <span className="text-3xl font-bold text-gray-800">{card.value}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* Task Status Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-md mb-8"
      >
        <h2 className="text-xl font-bold text-green-800 mb-6">Task Status Overview</h2>
        
        {/* Progress Bars */}
        <div className="space-y-4">
          {/* Under Candidate */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-500" />
                Under Candidate
              </span>
              <span className="text-sm font-medium text-gray-700">
                {stats.tasks.underCandidate} ({candidateProgress.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${candidateProgress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-blue-500 h-3 rounded-full"
              />
            </div>
          </div>

          {/* Under QA */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                Under QA Review
              </span>
              <span className="text-sm font-medium text-gray-700">
                {stats.tasks.underQA} ({qaProgress.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${qaProgress}%` }}
                transition={{ duration: 1, delay: 0.7 }}
                className="bg-yellow-500 h-3 rounded-full"
              />
            </div>
          </div>

          {/* Completed */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Completed
              </span>
              <span className="text-sm font-medium text-gray-700">
                {stats.tasks.completed} ({completedProgress.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completedProgress}%` }}
                transition={{ duration: 1, delay: 0.9 }}
                className="bg-green-500 h-3 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Pie Chart Representation */}
        <div className="mt-6 flex items-center justify-center">
          <div className="flex gap-8">
            {taskStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-md"
      >
        <h2 className="text-xl font-bold text-green-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="/admin/createTask"
            className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FileText className="w-6 h-6 text-green-600" />
            <span className="font-medium text-gray-700">Create New Task</span>
          </a>
          <a 
            href="/admin/createUser"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <UserCheck className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-gray-700">Add New User</span>
          </a>
          <a 
            href="/admin/manageUser"
            className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Users className="w-6 h-6 text-purple-600" />
            <span className="font-medium text-gray-700">Manage Users</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

