import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import TaskFilter from './components/TaskFilter';
import Header from './components/Header';
import { getFromLocalStorage, setToLocalStorage } from './utils/storage';
import { Plus } from 'lucide-react';

const App = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedUser = getFromLocalStorage('taskTrackerUser', null);
    const savedTasks = getFromLocalStorage('taskTrackerTasks', []);
    const savedDarkMode = getFromLocalStorage('taskTrackerDarkMode', false);

    setUser(savedUser);
    setTasks(savedTasks);
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    if (user) {
      setToLocalStorage('taskTrackerTasks', tasks);
    }
  }, [tasks, user]);

  useEffect(() => {
    setToLocalStorage('taskTrackerDarkMode', darkMode);
  }, [darkMode]);

  const handleLogin = (username) => {
    setUser(username);
    setToLocalStorage('taskTrackerUser', username);
  };

  const handleLogout = () => {
    setUser(null);
    setToLocalStorage('taskTrackerUser', null);
  };

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    setShowAddForm(false);
  };

  const updateTask = (taskId, taskData) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...taskData } : task
    ));
    setEditingTask(null);
  };

  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' ||
                         (filter === 'completed' && task.completed) ||
                         (filter === 'pending' && !task.completed);

    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto p-4">
        <Header
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {!showAddForm && !editingTask && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors mb-6 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Task
          </button>
        )}

        {(showAddForm || editingTask) && (
          <TaskForm
            onAddTask={addTask}
            onCancel={() => {
              setShowAddForm(false);
              setEditingTask(null);
            }}
            editingTask={editingTask}
            onUpdateTask={updateTask}
          />
        )}

        <TaskFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          taskCounts={taskCounts}
          darkMode={darkMode}
        />

        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p className="text-lg">
                {searchTerm 
                  ? 'No tasks found matching your search.' 
                  : tasks.length === 0 
                    ? 'No tasks yet. Add your first task!' 
                    : 'No tasks in this category.'
                }
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskComplete}
                onDeleteTask={deleteTask}
                onEditTask={setEditingTask}
                darkMode={darkMode}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
