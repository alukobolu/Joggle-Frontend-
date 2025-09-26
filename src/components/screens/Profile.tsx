import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Palette, 
  Brain, 
  Calendar, 
  Folder, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Clock
} from 'lucide-react';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Routines } from './Routines';

export function Profile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'routines'>('profile');

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', action: 'navigate' },
        { icon: Calendar, label: 'Calendar Integration', action: 'navigate' },
        { icon: Folder, label: 'Manage Categories', action: 'navigate' },
        { icon: Clock, label: 'Manage Routines', action: 'navigate' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', action: 'toggle', enabled: true },
        { icon: Palette, label: 'Dark Mode', action: 'toggle', enabled: true },
        { icon: Brain, label: 'AI Auto-Priority', action: 'toggle', enabled: true },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & FAQ', action: 'navigate' },
        { icon: Settings, label: 'About Joggle Task', action: 'navigate' },
      ]
    }
  ];

  const stats = [
    { label: 'Tasks Completed', value: '127', color: 'text-[#4CAF50]' },
    { label: 'Active Projects', value: '4', color: 'text-[#89CFF0]' },
    { label: 'Streak Days', value: '12', color: 'text-[#FFC947]' },
  ];

  return (
    <div className="flex-1 p-4 pb-24 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl text-white mb-6">Profile</h1>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#C9B6E4] text-black'
                : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('routines')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'routines'
                ? 'bg-[#C9B6E4] text-black'
                : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            <Clock className="w-4 h-4" />
            Routines
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'profile' ? (
        <>
          {/* User Info */}
          <Card className="bg-white/5 border-white/10 p-6 rounded-2xl mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/api/placeholder/64/64" alt="Profile" />
                <AvatarFallback className="bg-[#C9B6E4] text-black text-lg">R</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-white text-lg">Rakib Ahmed</h2>
                <p className="text-[#B0B0B0] text-sm">rakib@example.com</p>
                <p className="text-[#89CFF0] text-xs mt-1">Pro Member</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-lg ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-[#B0B0B0]">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Settings Groups */}
          <div className="space-y-6">
            {settingsGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="text-white text-sm mb-3 px-2">{group.title}</h3>
                <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                  {group.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    return (
                      <div key={itemIndex}>
                        <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-[#B0B0B0]" />
                            <span className="text-white text-sm">{item.label}</span>
                          </div>
                          
                          {item.action === 'toggle' ? (
                            <Switch 
                              checked={item.enabled} 
                              className="data-[state=checked]:bg-[#C9B6E4]"
                            />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-[#B0B0B0]" />
                          )}
                        </button>
                        
                        {itemIndex < group.items.length - 1 && (
                          <div className="h-px bg-white/10 mx-4" />
                        )}
                      </div>
                    );
                  })}
                </Card>
              </div>
            ))}

            {/* Logout */}
            <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
              <button className="w-full p-4 flex items-center gap-3 hover:bg-red-500/10 transition-colors">
                <LogOut className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm">Sign Out</span>
              </button>
            </Card>

            {/* App Version */}
            <div className="text-center text-[#B0B0B0] text-xs mt-8">
              Joggle Task v1.0.0
            </div>
          </div>
        </>
      ) : (
        <Routines />
      )}
    </div>
  );
}