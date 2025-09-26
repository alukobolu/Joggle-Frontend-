import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';

interface Task {
  id: number;
  title: string;
  project: string;
  priority: string;
  timeLabel: string;
  completed: boolean;
}

interface DraggableTaskProps {
  task: Task;
  index: number;
  onToggle: (taskId: number) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  getPriorityColor: (priority: string) => string;
  getProjectColor: (project: string) => string;
  isCompleted?: boolean;
}

export function DraggableTask({
  task,
  index,
  onToggle,
  onMove,
  getPriorityColor,
  getProjectColor,
  isCompleted = false
}: DraggableTaskProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'task',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: () => {
      return { id: task.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <Card 
      ref={ref}
      className={`${isCompleted ? 'bg-white/3 border-white/5 opacity-70' : 'bg-white/5 border-white/10 hover:bg-white/10'} p-4 rounded-2xl transition-all duration-200 cursor-move`}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="data-[state=checked]:bg-[#4CAF50] data-[state=checked]:border-[#4CAF50]"
          />
        </div>
        
        <div className="flex-1">
          <h3 className={`text-white text-sm mb-1 ${task.completed ? 'line-through' : ''} ${isCompleted ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs ${getProjectColor(task.project)} ${isCompleted ? 'opacity-60' : ''}`}>
                {task.project}
              </span>
              <div className="flex items-center gap-1 text-xs text-[#B0B0B0]">
                <Clock className="w-3 h-3" />
                <span>{task.timeLabel}</span>
              </div>
            </div>
            
            <div className={`w-1 h-4 rounded-full ${getPriorityColor(task.priority)} ${isCompleted ? 'opacity-50' : ''}`} />
          </div>
        </div>
      </div>
    </Card>
  );
}