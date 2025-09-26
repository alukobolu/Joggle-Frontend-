import React, { useState, useCallback, useRef } from 'react';
import { Clock, Check, ChevronDown, ChevronUp, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { DraggableTask } from '../DraggableTask';

export function TodaysFocus() {
  const [showCompleted, setShowCompleted] = useState(false);
  const [expandedToday, setExpandedToday] = useState(true);
  const [currentCard, setCurrentCard] = useState<'today' | 'tomorrow'>('today');
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Prepare investor deck presentation for everybody in nigeria that does business with us',
      project: 'Business',
      priority: 'high',
      timeLabel: 'Before 6pm',
      completed: false,
    },
    {
      id: 2,
      title: 'Review mobile app wireframes',
      project: 'Design',
      priority: 'high',
      timeLabel: 'Due Friday',
      completed: false,
    },
    {
      id: 3,
      title: 'Buy groceries for dinner',
      project: 'Personal',
      priority: 'medium',
      timeLabel: 'Before 7pm',
      completed: false,
    },
    {
      id: 4,
      title: 'Call with development team',
      project: 'Work',
      priority: 'medium',
      timeLabel: '2:00 PM',
      completed: true,
    },
    {
      id: 5,
      title: 'Update project documentation',
      project: 'Work',
      priority: 'low',
      timeLabel: 'End of day',
      completed: false,
    },
    {
      id: 6,
      title: 'Plan weekend family trip',
      project: 'Family',
      priority: 'low',
      timeLabel: 'This week',
      completed: false,
    },
    {
      id: 7,
      title: 'Plan weekend family trip',
      project: 'Family',
      priority: 'low',
      timeLabel: 'This week',
      completed: false,
    },
    {
      id: 8,
      title: 'Plan weekend family trip',
      project: 'Family',
      priority: 'low',
      timeLabel: 'This week',
      completed: false,
    },
    {
      id: 9,
      title: 'Plan weekend family trip',
      project: 'Family',
      priority: 'low',
      timeLabel: 'This week',
      completed: false,
    },
    {
      id: 10,
      title: 'Plan weekend family trip',
      project: 'Family',
      priority: 'low',
      timeLabel: 'This week',
      completed: false,
    },
    {
      id: 11,
      title: 'Plan weekend family trip',
      project: 'Family',
      priority: 'low',
      timeLabel: 'This week',
      completed: false,
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[#FF4C4C]';
      case 'medium': return 'bg-[#FFC947]';
      case 'low': return 'bg-[#4CAF50]';
      default: return 'bg-[#B0B0B0]';
    }
  };

  const getProjectColor = (project: string) => {
    switch (project) {
      case 'Business': return 'text-[#C9B6E4]';
      case 'Design': return 'text-[#A8E6CF]';
      case 'Work': return 'text-[#89CFF0]';
      case 'Personal': return 'text-[#FFF9A6]';
      case 'Family': return 'text-[#FF9AA2]';
      default: return 'text-[#B0B0B0]';
    }
  };

  const getProjectBgColor = (project: string) => {
    switch (project) {
      case 'Business': return 'bg-[#C9B6E4]';
      case 'Design': return 'bg-[#A8E6CF]';
      case 'Work': return 'bg-[#89CFF0]';
      case 'Personal': return 'bg-[#FFF9A6]';
      case 'Family': return 'bg-[#FF9AA2]';
      default: return 'bg-[#B0B0B0]';
    }
  };

  const getProjectTextColor = (project: string) => {
    switch (project) {
      case 'Business': return 'text-black';
      case 'Design': return 'text-black';
      case 'Work': return 'text-black';
      case 'Personal': return 'text-black';
      case 'Family': return 'text-black';
      default: return 'text-black';
    }
  };

  const tomorrowTasks = [
    {
      id: 101,
      title: 'Review quarterly reports',
      project: 'Business',
      priority: 'high',
      timeLabel: 'Morning',
      completed: false,
    },
    {
      id: 102,
      title: 'Team standup meeting',
      project: 'Work',
      priority: 'medium',
      timeLabel: '9:00 AM',
      completed: false,
    },
    {
      id: 103,
      title: 'Grocery shopping',
      project: 'Personal',
      priority: 'low',
      timeLabel: 'Afternoon',
      completed: false,
    },
    {
      id: 104,
      title: 'Client presentation prep',
      project: 'Business',
      priority: 'high',
      timeLabel: 'Evening',
      completed: false,
    },
  ];

  const tomorrowCompletedTasks = [
    {
      id: 105,
      title: 'Prepare meeting agenda',
      project: 'Work',
      priority: 'medium',
      timeLabel: 'Done',
      completed: true,
    },
    {
      id: 106,
      title: 'Research market trends',
      project: 'Business',
      priority: 'high',
      timeLabel: 'Done',
      completed: true,
    },
  ];

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const currentTasks = currentCard === 'today' ? incompleteTasks : tomorrowTasks;
  const currentCompletedTasks = currentCard === 'today' ? completedTasks : tomorrowCompletedTasks;

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setTasks(prevTasks => {
      const currentIncompleteTasks = prevTasks.filter(task => !task.completed);
      const currentCompletedTasks = prevTasks.filter(task => task.completed);
      
      const draggedTask = currentIncompleteTasks[dragIndex];
      const updatedIncompleteTasks = [...currentIncompleteTasks];
      updatedIncompleteTasks.splice(dragIndex, 1);
      updatedIncompleteTasks.splice(hoverIndex, 0, draggedTask);
      
      return [...updatedIncompleteTasks, ...currentCompletedTasks];
    });
  }, []);


  // Calculate category counts
  const getCategoryCounts = () => {
    const counts = tasks.reduce((acc, task) => {
      acc[task.project] = (acc[task.project] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  const categoryColors = {
    'Business': '#C9B6E4',
    'Design': '#A8E6CF', 
    'Work': '#89CFF0',
    'Personal': '#FFF9A6',
    'Family': '#FF9AA2'
  };

  const categoryCounts = getCategoryCounts();
  const swipeRef = useRef<HTMLDivElement>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentCard === 'today') {
      setCurrentCard('tomorrow');
    } else if (direction === 'right' && currentCard === 'tomorrow') {
      setCurrentCard('today');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          handleSwipe('right');
        } else {
          handleSwipe('left');
        }
      }
      
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className="flex-1 p-4 pb-24 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl text-white mb-2">Today's Focus</h1>
        <p className="text-[#B0B0B0] text-sm">
          {currentTasks.length} tasks remaining • {currentCompletedTasks.length} completed
        </p>
      </div>

      {/* Category Widgets */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <Card 
              key={category}
              className="bg-white/5 border-white/10 p-3 rounded-xl hover:bg-white/10 transition-all duration-200 flex-shrink-0 min-w-fit"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${categoryColors[category as keyof typeof categoryColors]}20` }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: categoryColors[category as keyof typeof categoryColors] }}
                  />
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">{category}</h3>
                  <p className="text-xs text-[#B0B0B0]">{count} task{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Swipeable Tasks Card */}
      <div className="mb-6">
        {/* Navigation Indicators */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentCard('today')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                currentCard === 'today' 
                  ? 'bg-white/10 text-white' 
                  : 'bg-white/5 text-[#B0B0B0] hover:bg-white/10'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setCurrentCard('tomorrow')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                currentCard === 'tomorrow' 
                  ? 'bg-white/10 text-white' 
                  : 'bg-white/5 text-[#B0B0B0] hover:bg-white/10'
              }`}
            >
              Tomorrow
            </button>
          </div>
          <div className="flex items-center gap-1">
            <ChevronLeft 
              className={`w-4 h-4 ${currentCard === 'today' ? 'text-[#B0B0B0]' : 'text-white cursor-pointer'}`}
              onClick={() => currentCard === 'tomorrow' && setCurrentCard('today')}
            />
            <ChevronRight 
              className={`w-4 h-4 ${currentCard === 'tomorrow' ? 'text-[#B0B0B0]' : 'text-white cursor-pointer'}`}
              onClick={() => currentCard === 'today' && setCurrentCard('tomorrow')}
            />
          </div>
        </div>

        {/* Swipeable Card */}
        <div 
          ref={swipeRef}
          onTouchStart={handleTouchStart}
          className="touch-pan-y"
        >
          <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
            <Collapsible
              open={expandedToday}
              onOpenChange={setExpandedToday}
            >
              <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${currentCard === 'today' ? 'bg-[#4CAF50]' : 'bg-[#89CFF0]'}`} />
                  <h3 className="text-white">
                    {currentCard === 'today' ? "Today's Tasks" : "Tomorrow's Tasks"}
                  </h3>
                  <span className="text-sm text-[#B0B0B0]">{currentTasks.length} tasks</span>
                </div>
                <div className={`transition-transform duration-200 ${expandedToday ? 'rotate-90' : ''}`}>
                  <MoreVertical className="w-4 h-4 text-[#B0B0B0] rotate-90" />
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-2">
                  {currentTasks.map((task, index) => (
                    <DraggableTask
                      task={task}
                      index={index}
                      onToggle={toggleTask}
                      onMove={moveTask}
                      getPriorityColor={getPriorityColor}
                      getProjectColor={getProjectColor}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      </div>
      

      {/* Completed Tasks */}
      {currentCompletedTasks.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="w-full text-left mb-4 flex items-center justify-between group hover:bg-white/5 rounded-lg p-2 -m-2 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#4CAF50]" />
              <h2 className="text-lg text-white">
                {currentCard === 'today' ? 'Completed' : 'Tomorrow\'s Completed'}
              </h2>
              <span className="text-sm text-[#B0B0B0]">({currentCompletedTasks.length})</span>
            </div>
            {showCompleted ? (
              <ChevronUp className="w-5 h-5 text-[#B0B0B0] group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#B0B0B0] group-hover:text-white transition-colors" />
            )}
          </button>
          
          {showCompleted && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
              {currentCompletedTasks.map((task, index) => (
                <DraggableTask
                  task={task}
                  index={index}
                  onToggle={toggleTask}
                  onMove={() => {}} // Completed tasks don't need to be reorderable
                  getPriorityColor={getPriorityColor}
                  getProjectColor={getProjectColor}
                  isCompleted={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}