import { useState, useEffect } from 'react';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: task,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setTask('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    if (editText.trim() !== '') {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editText } : t)));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const getFilteredTasks = () => {
    if (filter === 'active') {
      return tasks.filter((t) => !t.completed);
    }
    if (filter === 'completed') {
      return tasks.filter((t) => t.completed);
    }
    return tasks;
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          My Task Manager
        </h1>

        {/* Add Task Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && addTask()}
              placeholder="Enter a task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({tasks.length})
            </button>

            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active ({tasks.filter((t) => !t.completed).length})
            </button>

            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({tasks.filter((t) => t.completed).length})
            </button>

            <button
              onClick={clearCompleted}
              disabled={tasks.filter((t) => t.completed).length === 0}
              className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              Clear Completed
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tasks</h2>

          {getFilteredTasks().length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {tasks.length === 0
                ? 'No tasks yet. Add one above! 👆'
                : `No ${filter} tasks!`}
            </p>
          ) : (
            <ul className="space-y-3">
              {getFilteredTasks().map((t) => (
                <li
                  key={t.id}
                  className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                    t.completed ? 'bg-green-50' : 'bg-gray-100'
                  }`}
                >
                  {editingId === t.id ? (
                    <>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyUp={(e) => {
                          if (e.key === 'Enter') saveEdit(t.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                        className="flex-1 px-3 py-2 border-2 border-blue-500 rounded-lg focus:outline-none"
                      />
                      <button
                        onClick={() => saveEdit(t.id)}
                        className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span
                        onClick={() => toggleComplete(t.id)}
                        className={`flex-1 cursor-pointer text-base ${
                          t.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-800'
                        }`}
                      >
                        {t.completed && '✓ '}
                        {t.text}
                      </span>

                      <button
                        onClick={() => startEdit(t)}
                        disabled={t.completed}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteTask(t.id)}
                        className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm">
          <p>Built with React & Tailwind CSS • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
