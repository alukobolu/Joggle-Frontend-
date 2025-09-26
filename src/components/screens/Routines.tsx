import React, { useState } from 'react';
import { 
  Plus, 
  Clock, 
  Calendar, 
  Repeat, 
  Edit3, 
  Trash2, 
  Play, 
  Pause,
  ChevronRight,
  Sun,
  Moon,
  Briefcase,
  Home,
  Calendar as CalendarIcon,
  RotateCcw
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';

interface TimeSlot {
  id: string;
  time: string;
  timeType: 'specific' | 'morning' | 'afternoon' | 'evening' | 'night';
}

interface Routine {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'quarterly' | 'workdays' | 'weekends';
  isActive: boolean;
  category: string;
  
  // Daily scheduling
  dailyTimes?: number; // how many times per day
  dailyTimeSlots?: TimeSlot[]; // specific times or time periods
  
  // Weekly scheduling
  weeklyTimes?: number; // how many times per week
  weeklyDays?: string[]; // specific days
  weeklyTimeSlots?: TimeSlot[]; // time details for each occurrence
  
  // Monthly scheduling
  monthlyTimes?: number; // how many times per month
  monthlyType?: 'week' | 'day'; // week-based or day-based
  monthlyWeeks?: number[]; // which weeks (1st, 2nd, 3rd, 4th)
  monthlyDays?: number[]; // specific days of month (1-31)
  monthlyTimeSlots?: TimeSlot[];
  
  // Quarterly/Yearly scheduling
  quarterlyTimes?: number;
  yearlyTimes?: number;
  quarterlyMonths?: string[];
  yearlyMonths?: string[];
  quarterlyTimeSlots?: TimeSlot[];
  yearlyTimeSlots?: TimeSlot[];
}

const frequencyOptions = [
  { value: 'daily', label: 'Daily', icon: Repeat },
  { value: 'workdays', label: 'Work Days', icon: Briefcase },
  { value: 'weekends', label: 'Weekends', icon: Home },
  { value: 'weekly', label: 'Weekly', icon: Calendar },
  { value: 'monthly', label: 'Monthly', icon: CalendarIcon },
  { value: 'quarterly', label: 'Quarterly', icon: RotateCcw },
  { value: 'yearly', label: 'Yearly', icon: CalendarIcon },
];

const timeTypeOptions = [
  { value: 'specific', label: 'Specific Time' },
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
];

const monthOptions = [
  { value: 'january', label: 'January' },
  { value: 'february', label: 'February' },
  { value: 'march', label: 'March' },
  { value: 'april', label: 'April' },
  { value: 'may', label: 'May' },
  { value: 'june', label: 'June' },
  { value: 'july', label: 'July' },
  { value: 'august', label: 'August' },
  { value: 'september', label: 'September' },
  { value: 'october', label: 'October' },
  { value: 'november', label: 'November' },
  { value: 'december', label: 'December' },
];

const categoryOptions = [
  { value: 'Health', label: 'Health' },
  { value: 'Work', label: 'Work' },
  { value: 'Personal', label: 'Personal' },
  { value: 'Learning', label: 'Learning' },
  { value: 'Fitness', label: 'Fitness' },
  { value: 'Planning', label: 'Planning' },
  { value: 'Social', label: 'Social' },
  { value: 'Creative', label: 'Creative' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Other', label: 'Other' },
];

const dayOptions = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' },
];

export function Routines() {
  const [routines, setRoutines] = useState<Routine[]>([
    {
      id: '1',
      title: 'Morning Exercise',
      description: '30 minutes of cardio and strength training',
      frequency: 'daily',
      dailyTimes: 1,
      dailyTimeSlots: [{ id: '1', time: '07:00', timeType: 'specific' }],
      isActive: true,
      category: 'Health'
    },
    {
      id: '2',
      title: 'Team Standup',
      description: 'Daily team sync meeting',
      frequency: 'workdays',
      dailyTimes: 1,
      dailyTimeSlots: [{ id: '1', time: '09:30', timeType: 'specific' }],
      isActive: true,
      category: 'Work'
    },
    {
      id: '3',
      title: 'Weekly Review',
      description: 'Review goals and plan next week',
      frequency: 'weekly',
      weeklyTimes: 1,
      weeklyDays: ['sunday'],
      weeklyTimeSlots: [{ id: '1', time: '18:00', timeType: 'specific' }],
      isActive: true,
      category: 'Planning'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [newRoutine, setNewRoutine] = useState<Partial<Routine>>({
    title: '',
    description: '',
    frequency: 'daily',
    isActive: true,
    category: 'Health',
    dailyTimes: 1,
    dailyTimeSlots: [{ id: '1', time: '09:00', timeType: 'specific' }]
  });

  const handleAddRoutine = () => {
    if (!newRoutine.title) return;
    
    const routine: Routine = {
      id: Date.now().toString(),
      title: newRoutine.title!,
      description: newRoutine.description || '',
      frequency: newRoutine.frequency!,
      isActive: newRoutine.isActive!,
      category: newRoutine.category!,
      dailyTimes: newRoutine.dailyTimes,
      dailyTimeSlots: newRoutine.dailyTimeSlots,
      weeklyTimes: newRoutine.weeklyTimes,
      weeklyDays: newRoutine.weeklyDays,
      weeklyTimeSlots: newRoutine.weeklyTimeSlots,
      monthlyTimes: newRoutine.monthlyTimes,
      monthlyType: newRoutine.monthlyType,
      monthlyWeeks: newRoutine.monthlyWeeks,
      monthlyDays: newRoutine.monthlyDays,
      monthlyTimeSlots: newRoutine.monthlyTimeSlots,
      quarterlyTimes: newRoutine.quarterlyTimes,
      quarterlyMonths: newRoutine.quarterlyMonths,
      quarterlyTimeSlots: newRoutine.quarterlyTimeSlots,
      yearlyTimes: newRoutine.yearlyTimes,
      yearlyMonths: newRoutine.yearlyMonths,
      yearlyTimeSlots: newRoutine.yearlyTimeSlots
    };

    setRoutines([...routines, routine]);
    setNewRoutine({
      title: '',
      description: '',
      frequency: 'daily',
      isActive: true,
      category: 'Health',
      dailyTimes: 1,
      dailyTimeSlots: [{ id: '1', time: '09:00', timeType: 'specific' }]
    });
    setShowAddForm(false);
  };

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine);
    setNewRoutine(routine);
    setShowAddForm(true);
  };

  const handleUpdateRoutine = () => {
    if (!editingRoutine || !newRoutine.title) return;
    
    setRoutines(routines.map(r => 
      r.id === editingRoutine.id 
        ? { ...r, ...newRoutine } as Routine
        : r
    ));
    setEditingRoutine(null);
    setNewRoutine({
      title: '',
      description: '',
      frequency: 'daily',
      isActive: true,
      category: 'Health',
      dailyTimes: 1,
      dailyTimeSlots: [{ id: '1', time: '09:00', timeType: 'specific' }]
    });
    setShowAddForm(false);
  };

  const handleDeleteRoutine = (id: string) => {
    setRoutines(routines.filter(r => r.id !== id));
  };

  const toggleRoutineActive = (id: string) => {
    setRoutines(routines.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const getFrequencyLabel = (frequency: string) => {
    return frequencyOptions.find(opt => opt.value === frequency)?.label || frequency;
  };

  const getFrequencyIcon = (frequency: string) => {
    const option = frequencyOptions.find(opt => opt.value === frequency);
    return option ? option.icon : Repeat;
  };

  const getTimeSlotDisplay = (routine: Routine) => {
    if (routine.frequency === 'daily' && routine.dailyTimeSlots) {
      return routine.dailyTimeSlots.map(slot => {
        if (slot.timeType === 'specific') return slot.time;
        return slot.timeType.charAt(0).toUpperCase() + slot.timeType.slice(1);
      }).join(', ');
    }
    if (routine.frequency === 'weekly' && routine.weeklyTimeSlots) {
      return routine.weeklyTimeSlots.map(slot => {
        if (slot.timeType === 'specific') return slot.time;
        return slot.timeType.charAt(0).toUpperCase() + slot.timeType.slice(1);
      }).join(', ');
    }
    return '';
  };

  const getScheduleDetails = (routine: Routine) => {
    const details: string[] = [];
    
    if (routine.frequency === 'daily') {
      details.push(`${routine.dailyTimes || 1} time(s) per day`);
    } else if (routine.frequency === 'weekly') {
      details.push(`${routine.weeklyTimes || 1} time(s) per week`);
      if (routine.weeklyDays && routine.weeklyDays.length > 0) {
        const dayLabels = routine.weeklyDays.map(day => 
          dayOptions.find(d => d.value === day)?.label || day
        );
        details.push(`Days: ${dayLabels.join(', ')}`);
      }
    } else if (routine.frequency === 'monthly') {
      details.push(`${routine.monthlyTimes || 1} time(s) per month`);
      if (routine.monthlyType === 'week' && routine.monthlyWeeks) {
        const weekLabels = routine.monthlyWeeks.map(week => 
          week === 1 ? '1st' : week === 2 ? '2nd' : week === 3 ? '3rd' : '4th'
        );
        details.push(`Weeks: ${weekLabels.join(', ')}`);
      } else if (routine.monthlyType === 'day' && routine.monthlyDays) {
        details.push(`Days: ${routine.monthlyDays.join(', ')}`);
      }
    } else if (routine.frequency === 'quarterly') {
      details.push(`${routine.quarterlyTimes || 1} time(s) per quarter`);
      if (routine.quarterlyMonths && routine.quarterlyMonths.length > 0) {
        const monthLabels = routine.quarterlyMonths.map(month => 
          monthOptions.find(m => m.value === month)?.label || month
        );
        details.push(`Months: ${monthLabels.join(', ')}`);
      }
    } else if (routine.frequency === 'yearly') {
      details.push(`${routine.yearlyTimes || 1} time(s) per year`);
      if (routine.yearlyMonths && routine.yearlyMonths.length > 0) {
        const monthLabels = routine.yearlyMonths.map(month => 
          monthOptions.find(m => m.value === month)?.label || month
        );
        details.push(`Months: ${monthLabels.join(', ')}`);
      }
    }
    
    return details;
  };

  return (
    <div className="flex-1 p-4 pb-24 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl text-white mb-6">Routines</h1>
        
        {/* Add Routine Button */}
        <Button 
          onClick={() => setShowAddForm(true)}
          className="w-full bg-[#C9B6E4] hover:bg-[#B8A5D4] text-black font-medium rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Routine
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="bg-white/5 border-white/10 p-6 rounded-2xl mb-6">
          <h3 className="text-white text-lg mb-4">
            {editingRoutine ? 'Edit Routine' : 'Add New Routine'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">Title</label>
              <Input
                value={newRoutine.title || ''}
                onChange={(e) => setNewRoutine({...newRoutine, title: e.target.value})}
                placeholder="Enter routine title"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Description</label>
              <Textarea
                value={newRoutine.description || ''}
                onChange={(e) => setNewRoutine({...newRoutine, description: e.target.value})}
                placeholder="Enter routine description"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                rows={3}
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Category</label>
              <select
                value={newRoutine.category || 'Health'}
                onChange={(e) => setNewRoutine({...newRoutine, category: e.target.value})}
                className="bg-white/10 border-white/20 text-white rounded-lg px-3 py-2 w-full"
                style={{ colorScheme: 'dark' }}
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Frequency</label>
              <div className="grid grid-cols-2 gap-2">
                {frequencyOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setNewRoutine({...newRoutine, frequency: option.value as any})}
                      className={`p-3 rounded-lg border transition-colors flex items-center gap-2 ${
                        newRoutine.frequency === option.value
                          ? 'bg-[#C9B6E4] text-black border-[#C9B6E4]'
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Advanced Scheduling based on frequency */}
            {newRoutine.frequency === 'daily' && (
              <Card className="bg-white/5 border-white/10 p-4 rounded-xl">
                <h4 className="text-white text-sm font-medium mb-3">Daily Schedule</h4>
                <div>
                  <label className="text-white text-sm mb-2 block">Times per day?</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={newRoutine.dailyTimes || 1}
                  onChange={(e) => {
                    const times = parseInt(e.target.value) || 1;
                    const timeSlots = Array.from({ length: times }, (_, i) => ({
                      id: `${i + 1}`,
                      time: '09:00',
                      timeType: 'specific' as const
                    }));
                    setNewRoutine({...newRoutine, dailyTimes: times, dailyTimeSlots: timeSlots});
                  }}
                  className="bg-white/10 border-white/20 text-white"
                />
                
                <div className="mt-4 space-y-3">
                  <label className="text-white text-sm">Time Slots:</label>
                  {(newRoutine.dailyTimeSlots || []).map((slot, index) => (
                    <div key={slot.id} className="flex gap-2 items-center">
                      <span className="text-white text-sm w-16">{index + 1}:</span>
                      <select
                        value={slot.timeType}
                        onChange={(e) => {
                          const updatedSlots = [...(newRoutine.dailyTimeSlots || [])];
                          updatedSlots[index] = {...slot, timeType: e.target.value as any};
                          setNewRoutine({...newRoutine, dailyTimeSlots: updatedSlots});
                        }}
                        className="bg-white/10 border-white/20 text-white rounded px-2 py-1 text-sm"
                        style={{ colorScheme: 'dark' }}
                      >
                        {timeTypeOptions.map(option => (
                          <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {slot.timeType === 'specific' && (
                        <Input
                          type="time"
                          value={slot.time}
                          onChange={(e) => {
                            const updatedSlots = [...(newRoutine.dailyTimeSlots || [])];
                            updatedSlots[index] = {...slot, time: e.target.value};
                            setNewRoutine({...newRoutine, dailyTimeSlots: updatedSlots});
                          }}
                          className="bg-white/10 border-white/20 text-white text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
                </div>
              </Card>
            )}

            {newRoutine.frequency === 'weekly' && (
              <Card className="bg-white/5 border-white/10 p-4 rounded-xl">
                <h4 className="text-white text-sm font-medium mb-3">Weekly Schedule</h4>
              <div>
                <div className="mb-4">
                  <label className="text-white text-sm mb-2 block">Times per week?</label>
                  <Input
                    type="number"
                    min="1"
                    max="7"
                    value={newRoutine.weeklyTimes || 1}
                    onChange={(e) => {
                      const times = parseInt(e.target.value) || 1;
                      setNewRoutine({...newRoutine, weeklyTimes: times});
                    }}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="text-white text-sm mb-2 block">Select Days:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {dayOptions.map((day) => (
                      <button
                        key={day.value}
                        onClick={() => {
                          const days = newRoutine.weeklyDays || [];
                          const newDays = days.includes(day.value)
                            ? days.filter(d => d !== day.value)
                            : [...days, day.value];
                          setNewRoutine({...newRoutine, weeklyDays: newDays});
                        }}
                        className={`p-2 rounded-lg border transition-colors text-sm ${
                          (newRoutine.weeklyDays || []).includes(day.value)
                            ? 'bg-[#C9B6E4] text-black border-[#C9B6E4]'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-white text-sm">Time Details:</label>
                  {(newRoutine.weeklyTimeSlots || []).map((slot, index) => (
                    <div key={slot.id} className="flex gap-2 items-center">
                      <span className="text-white text-sm w-16">Time {index + 1}:</span>
                      <select
                        value={slot.timeType}
                        onChange={(e) => {
                          const updatedSlots = [...(newRoutine.weeklyTimeSlots || [])];
                          updatedSlots[index] = {...slot, timeType: e.target.value as any};
                          setNewRoutine({...newRoutine, weeklyTimeSlots: updatedSlots});
                        }}
                        className="bg-white/10 border-white/20 text-white rounded px-2 py-1 text-sm"
                        style={{ colorScheme: 'dark' }}
                      >
                        {timeTypeOptions.map(option => (
                          <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {slot.timeType === 'specific' && (
                        <Input
                          type="time"
                          value={slot.time}
                          onChange={(e) => {
                            const updatedSlots = [...(newRoutine.weeklyTimeSlots || [])];
                            updatedSlots[index] = {...slot, time: e.target.value};
                            setNewRoutine({...newRoutine, weeklyTimeSlots: updatedSlots});
                          }}
                          className="bg-white/10 border-white/20 text-white text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
                </div>
              </Card>
            )}

            {newRoutine.frequency === 'monthly' && (
              <Card className="bg-white/5 border-white/10 p-4 rounded-xl">
                <h4 className="text-white text-sm font-medium mb-3">Monthly Schedule</h4>
              <div>
                <div className="mb-4">
                  <label className="text-white text-sm mb-2 block">Times per month?</label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={newRoutine.monthlyTimes || 1}
                    onChange={(e) => {
                      const times = parseInt(e.target.value) || 1;
                      setNewRoutine({...newRoutine, monthlyTimes: times});
                    }}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="text-white text-sm mb-2 block">Schedule Type:</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNewRoutine({...newRoutine, monthlyType: 'week'})}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        newRoutine.monthlyType === 'week'
                          ? 'bg-[#C9B6E4] text-black'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      By Week
                    </button>
                    <button
                      onClick={() => setNewRoutine({...newRoutine, monthlyType: 'day'})}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        newRoutine.monthlyType === 'day'
                          ? 'bg-[#C9B6E4] text-black'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      By Day
                    </button>
                  </div>
                </div>
                
                {newRoutine.monthlyType === 'week' && (
                  <div className="mb-4">
                    <label className="text-white text-sm mb-2 block">Which weeks?</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map(week => (
                        <button
                          key={week}
                          onClick={() => {
                            const weeks = newRoutine.monthlyWeeks || [];
                            const newWeeks = weeks.includes(week)
                              ? weeks.filter(w => w !== week)
                              : [...weeks, week];
                            setNewRoutine({...newRoutine, monthlyWeeks: newWeeks});
                          }}
                          className={`px-3 py-2 rounded-lg text-sm ${
                            (newRoutine.monthlyWeeks || []).includes(week)
                              ? 'bg-[#C9B6E4] text-black'
                              : 'bg-white/5 text-white hover:bg-white/10'
                          }`}
                        >
                          {week === 1 ? '1st' : week === 2 ? '2nd' : week === 3 ? '3rd' : '4th'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {newRoutine.monthlyType === 'day' && (
                  <div className="mb-4">
                    <label className="text-white text-sm mb-2 block">Which days of the month?</label>
                    <div className="bg-white/5 rounded-lg p-3">
                      {/* Calendar header */}
                      <div className="flex gap-1 mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                          <div key={day} className="w-8 h-6 text-center text-xs text-[#B0B0B0] flex items-center justify-center">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      {/* Calendar days */}
                      <div className="flex flex-col gap-1">
                        {/* Week 1 */}
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5, 6, 7].map(day => (
                            <button
                              key={day}
                              onClick={() => {
                                const days = newRoutine.monthlyDays || [];
                                const newDays = days.includes(day)
                                  ? days.filter(d => d !== day)
                                  : [...days, day];
                                setNewRoutine({...newRoutine, monthlyDays: newDays});
                              }}
                              className={`w-8 h-8 rounded text-xs flex items-center justify-center transition-colors ${
                                (newRoutine.monthlyDays || []).includes(day)
                                  ? 'bg-[#C9B6E4] text-black'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                        
                        {/* Week 2 */}
                        <div className="flex gap-1">
                          {[8, 9, 10, 11, 12, 13, 14].map(day => (
                            <button
                              key={day}
                              onClick={() => {
                                const days = newRoutine.monthlyDays || [];
                                const newDays = days.includes(day)
                                  ? days.filter(d => d !== day)
                                  : [...days, day];
                                setNewRoutine({...newRoutine, monthlyDays: newDays});
                              }}
                              className={`w-8 h-8 rounded text-xs flex items-center justify-center transition-colors ${
                                (newRoutine.monthlyDays || []).includes(day)
                                  ? 'bg-[#C9B6E4] text-black'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                        
                        {/* Week 3 */}
                        <div className="flex gap-1">
                          {[15, 16, 17, 18, 19, 20, 21].map(day => (
                            <button
                              key={day}
                              onClick={() => {
                                const days = newRoutine.monthlyDays || [];
                                const newDays = days.includes(day)
                                  ? days.filter(d => d !== day)
                                  : [...days, day];
                                setNewRoutine({...newRoutine, monthlyDays: newDays});
                              }}
                              className={`w-8 h-8 rounded text-xs flex items-center justify-center transition-colors ${
                                (newRoutine.monthlyDays || []).includes(day)
                                  ? 'bg-[#C9B6E4] text-black'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                        
                        {/* Week 4 */}
                        <div className="flex gap-1">
                          {[22, 23, 24, 25, 26, 27, 28].map(day => (
                            <button
                              key={day}
                              onClick={() => {
                                const days = newRoutine.monthlyDays || [];
                                const newDays = days.includes(day)
                                  ? days.filter(d => d !== day)
                                  : [...days, day];
                                setNewRoutine({...newRoutine, monthlyDays: newDays});
                              }}
                              className={`w-8 h-8 rounded text-xs flex items-center justify-center transition-colors ${
                                (newRoutine.monthlyDays || []).includes(day)
                                  ? 'bg-[#C9B6E4] text-black'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                        
                        {/* Week 5 */}
                        <div className="flex gap-1">
                          {[29, 30, 31].map(day => (
                            <button
                              key={day}
                              onClick={() => {
                                const days = newRoutine.monthlyDays || [];
                                const newDays = days.includes(day)
                                  ? days.filter(d => d !== day)
                                  : [...days, day];
                                setNewRoutine({...newRoutine, monthlyDays: newDays});
                              }}
                              className={`w-8 h-8 rounded text-xs flex items-center justify-center transition-colors ${
                                (newRoutine.monthlyDays || []).includes(day)
                                  ? 'bg-[#C9B6E4] text-black'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                          {/* Empty spaces for alignment */}
                          <div className="w-8 h-8"></div>
                          <div className="w-8 h-8"></div>
                          <div className="w-8 h-8"></div>
                          <div className="w-8 h-8"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </Card>
            )}

            {newRoutine.frequency === 'quarterly' && (
              <Card className="bg-white/5 border-white/10 p-4 rounded-xl">
                <h4 className="text-white text-sm font-medium mb-3">Quarterly Schedule</h4>
              <div>
                <div className="mb-4">
                  <label className="text-white text-sm mb-2 block">Times per quarter?</label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={newRoutine.quarterlyTimes || 1}
                    onChange={(e) => {
                      const times = parseInt(e.target.value) || 1;
                      setNewRoutine({...newRoutine, quarterlyTimes: times});
                    }}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="text-white text-sm mb-2 block">Select Months:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {monthOptions.map((month) => (
                      <button
                        key={month.value}
                        onClick={() => {
                          const months = newRoutine.quarterlyMonths || [];
                          const newMonths = months.includes(month.value)
                            ? months.filter(m => m !== month.value)
                            : [...months, month.value];
                          setNewRoutine({...newRoutine, quarterlyMonths: newMonths});
                        }}
                        className={`p-2 rounded-lg border transition-colors text-sm ${
                          (newRoutine.quarterlyMonths || []).includes(month.value)
                            ? 'bg-[#C9B6E4] text-black border-[#C9B6E4]'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        {month.label}
                      </button>
                    ))}
                  </div>
                </div>
                </div>
              </Card>
            )}

            {newRoutine.frequency === 'yearly' && (
              <Card className="bg-white/5 border-white/10 p-4 rounded-xl">
                <h4 className="text-white text-sm font-medium mb-3">Yearly Schedule</h4>
              <div>
                <div className="mb-4">
                  <label className="text-white text-sm mb-2 block">Times per year?</label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={newRoutine.yearlyTimes || 1}
                    onChange={(e) => {
                      const times = parseInt(e.target.value) || 1;
                      setNewRoutine({...newRoutine, yearlyTimes: times});
                    }}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="text-white text-sm mb-2 block">Select Months:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {monthOptions.map((month) => (
                      <button
                        key={month.value}
                        onClick={() => {
                          const months = newRoutine.yearlyMonths || [];
                          const newMonths = months.includes(month.value)
                            ? months.filter(m => m !== month.value)
                            : [...months, month.value];
                          setNewRoutine({...newRoutine, yearlyMonths: newMonths});
                        }}
                        className={`p-2 rounded-lg border transition-colors text-sm ${
                          (newRoutine.yearlyMonths || []).includes(month.value)
                            ? 'bg-[#C9B6E4] text-black border-[#C9B6E4]'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        {month.label}
                      </button>
                    ))}
                  </div>
                </div>
                </div>
              </Card>
            )}


            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={newRoutine.isActive || false}
                  onCheckedChange={(checked) => setNewRoutine({...newRoutine, isActive: checked})}
                  className="data-[state=checked]:bg-[#C9B6E4]"
                />
                <span className="text-white text-sm">Active</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={editingRoutine ? handleUpdateRoutine : handleAddRoutine}
                className="flex-1 bg-[#C9B6E4] hover:bg-[#B8A5D4] text-black font-medium"
              >
                {editingRoutine ? 'Update Routine' : 'Add Routine'}
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingRoutine(null);
                  setNewRoutine({
                    title: '',
                    description: '',
                    frequency: 'daily',
                    isActive: true,
                    category: 'General',
                    dailyTimes: 1,
                    dailyTimeSlots: [{ id: '1', time: '09:00', timeType: 'specific' }]
                  });
                }}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Routines List */}
      <div className="space-y-4">
        {routines.length === 0 ? (
          <Card className="bg-white/5 border-white/10 p-8 rounded-2xl text-center">
            <Clock className="w-12 h-12 text-[#B0B0B0] mx-auto mb-4" />
            <h3 className="text-white text-lg mb-2">No Routines Yet</h3>
            <p className="text-[#B0B0B0] text-sm">Create your first routine to get started</p>
          </Card>
        ) : (
          routines.map((routine) => {
            const FrequencyIcon = getFrequencyIcon(routine.frequency);
            return (
              <Card key={routine.id} className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white text-lg font-medium">{routine.title}</h3>
                        <div className={`w-2 h-2 rounded-full ${routine.isActive ? 'bg-green-400' : 'bg-gray-400'}`} />
                      </div>
                      <p className="text-[#B0B0B0] text-sm mb-2">{routine.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-xs text-[#B0B0B0]">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getTimeSlotDisplay(routine)}
                          </div>
                          <div className="flex items-center gap-1">
                            <FrequencyIcon className="w-3 h-3" />
                            {getFrequencyLabel(routine.frequency)}
                          </div>
                          <span className="bg-white/10 px-2 py-1 rounded-full">
                            {routine.category}
                          </span>
                        </div>
                        <div className="text-xs text-[#B0B0B0]">
                          {getScheduleDetails(routine).map((detail, index) => (
                            <div key={index}>{detail}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={routine.isActive}
                        onCheckedChange={() => toggleRoutineActive(routine.id)}
                        className="data-[state=checked]:bg-[#C9B6E4]"
                      />
                      <span className="text-white text-sm">
                        {routine.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleEditRoutine(routine)}
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteRoutine(routine.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-400/20 text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
