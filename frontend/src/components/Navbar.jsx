import React from 'react';
import { CheckSquare, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Application Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <CheckSquare className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700">
                <User className="w-4 h-4 text-indigo-600" />
                <span>{user.name}</span>
              </div>
            )}

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};
