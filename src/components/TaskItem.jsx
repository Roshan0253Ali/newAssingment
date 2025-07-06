import React, { useState } from 'react';
import { Edit3, Trash2, Check } from 'lucide-react';

const TaskItem = ({ task, onToggleComplete, onDeleteTask, onEditTask, darkMode }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              task.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : `border-gray-300 hover:border-indigo-500 ${darkMode ? 'hover:border-indigo-400' : ''}`
            }`}
          >
            {task.completed && <Check className="w-3 h-3" />}
          </button>

          <div className="flex-1">
            <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : darkMode ? 'text-white' : 'text-gray-800'}`}>
              {task.title}
            </h3>

            {task.description && (
              <p className={`text-sm mt-1 ${task.completed ? 'line-through text-gray-400' : darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>

              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Created: {formatDate(task.createdAt)}
              </span>

              {task.dueDate && (
                <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Due: {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEditTask(task)}
            className={`p-1 rounded hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'} transition-colors`}
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className={`p-1 rounded hover:bg-red-100 ${darkMode ? 'hover:bg-red-900 text-red-400' : 'text-red-500'} transition-colors`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800 mb-2">
            Are you sure you want to delete this task?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onDeleteTask(task.id);
                setShowDeleteConfirm(false);
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;