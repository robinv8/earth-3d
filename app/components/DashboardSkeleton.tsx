'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 animate-pulse">
      {/* Header */}
      <div className="col-span-full bg-gray-800 rounded-lg p-6 mb-6">
        <Skeleton height={40} baseColor="#374151" highlightColor="#4B5563" />
        <div className="mt-2">
          <Skeleton height={20} width="60%" baseColor="#374151" highlightColor="#4B5563" />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-6">
            <Skeleton height={24} width="40%" baseColor="#374151" highlightColor="#4B5563" />
            <div className="mt-4">
              <Skeleton height={40} width="30%" baseColor="#374151" highlightColor="#4B5563" />
            </div>
            <div className="mt-2">
              <Skeleton height={16} width="50%" baseColor="#374151" highlightColor="#4B5563" />
            </div>
            <div className="h-32 mt-4">
              <Skeleton height="100%" baseColor="#374151" highlightColor="#4B5563" />
            </div>
          </div>
        ))}

        {/* Main Chart */}
        <div className="col-span-full lg:col-span-2 bg-gray-800 rounded-lg p-6">
          <Skeleton height={32} width="30%" baseColor="#374151" highlightColor="#4B5563" />
          <div className="h-80 mt-4">
            <Skeleton height="100%" baseColor="#374151" highlightColor="#4B5563" />
          </div>
        </div>

        {/* Side Chart */}
        <div className="col-span-full lg:col-span-1 bg-gray-800 rounded-lg p-6">
          <Skeleton height={32} width="40%" baseColor="#374151" highlightColor="#4B5563" />
          <div className="h-80 mt-4">
            <Skeleton height="100%" baseColor="#374151" highlightColor="#4B5563" />
          </div>
        </div>
      </div>
    </div>
  );
}
