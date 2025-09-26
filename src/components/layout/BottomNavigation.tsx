import React from 'react';
import { Home, CheckSquare, Map, User, Plus, Lightbulb } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onFabClick: () => void;
}

export function BottomNavigation({ activeTab, onTabChange, onFabClick }: BottomNavigationProps) {
  const tabs = [
    { id: 'today', label: 'Today', icon: Home },
    { id: 'tasks', label: 'All Tasks', icon: CheckSquare },
    // { id: 'ideas', label: 'Ideas', icon: Lightbulb },
    { id: 'plans', label: 'Plans', icon: Map },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* FAB */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={onFabClick}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-[#C9B6E4] to-[#89CFF0] shadow-lg shadow-black/20 flex items-center justify-center hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-6 h-6 text-black" />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#1e1e1e] border-t border-white/10 px-4 py-2 pb-8">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-[#C9B6E4]' 
                    : 'text-[#B0B0B0] hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'drop-shadow-[0_0_8px_#C9B6E4]' : ''}`} />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}