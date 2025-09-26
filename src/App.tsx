import React, { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { Dashboard } from './components/screens/Dashboard';
import { TodaysFocus } from './components/screens/TodaysFocus';
import { AllTasks } from './components/screens/AllTasks';
import { AllPlans } from './components/screens/AllPlans';
import { PlanDetail } from './components/screens/PlanDetail';
import { Profile } from './components/screens/Profile';
import { Onboarding } from './components/screens/Onboarding';
import { AddTaskModal } from './components/modals/AddTaskModal';
import { Ideas } from './components/screens/Ideas';

interface Plan {
  id: string;
  title: string;
  description: string;
  steps: any[];
  createdAt: string;
  updatedAt: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const ideasRef = useRef<{ openAddIdea: () => void } | null>(null);
  const plansRef = useRef<{ openAddPlan: () => void } | null>(null);
  const planDetailRef = useRef<{ addNewStep: () => void } | null>(null);

  // Detect if device supports touch for DnD backend selection
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;

  // Initialize dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setActiveTab('today');
  };

  const handleFabClick = () => {
    if (activeTab === 'ideas') {
      ideasRef.current?.openAddIdea?.();
      return;
    }
    if (activeTab === 'plans') {
      if (selectedPlan) {
        planDetailRef.current?.addNewStep?.();
      } else {
        plansRef.current?.openAddPlan?.();
      }
      return;
    }
    // Default for task-related screens: open Add Task modal
    setShowAddTaskModal(true);
  };

  const handleSaveTask = (task: any) => {
    // In a real app, this would save to a backend or local storage
    console.log('New task:', task);
    // You could add toast notification here
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleBackToPlans = () => {
    setSelectedPlan(null);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'today':
        return <TodaysFocus />;
      case 'tasks':
        return <AllTasks />;
      case 'ideas':
        return <Ideas ref={ideasRef} />;
      case 'plans':
        if (selectedPlan) {
          return <PlanDetail ref={planDetailRef} plan={selectedPlan} onBack={handleBackToPlans} />;
        }
        return <AllPlans ref={plansRef} onPlanSelect={handlePlanSelect} />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <DndProvider backend={dndBackend}>
      <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a] flex flex-col max-w-md mx-auto relative">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {renderActiveScreen()}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onFabClick={handleFabClick}
        />

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={showAddTaskModal}
          onClose={() => setShowAddTaskModal(false)}
          onSave={handleSaveTask}
        />
      </div>
    </DndProvider>
  );
}

export default App;