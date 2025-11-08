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

  // Save to localStorage whenever tasks change
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
    <div
      style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ color: '#333', marginBottom: '30px' }}>My Task Manager</h1>

      {/* Add Task Section */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && addTask()}
          placeholder="Enter a task..."
          style={{
            padding: '10px',
            width: '300px',
            fontSize: '16px',
            marginRight: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />

        <button
          onClick={addTask}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#45a049')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#4CAF50')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          Add Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          borderBottom: '2px solid #ddd',
          paddingBottom: '10px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: filter === 'all' ? '#4CAF50' : '#fff',
            color: filter === 'all' ? '#fff' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: filter === 'all' ? 'bold' : 'normal',
          }}
        >
          All ({tasks.length})
        </button>

        <button
          onClick={() => setFilter('active')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: filter === 'active' ? '#4CAF50' : '#fff',
            color: filter === 'active' ? '#fff' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: filter === 'active' ? 'bold' : 'normal',
          }}
        >
          Active ({tasks.filter((t) => !t.completed).length})
        </button>

        <button
          onClick={() => setFilter('completed')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: filter === 'completed' ? '#4CAF50' : '#fff',
            color: filter === 'completed' ? '#fff' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: filter === 'completed' ? 'bold' : 'normal',
          }}
        >
          Completed ({tasks.filter((t) => t.completed).length})
        </button>

        <button
          onClick={clearCompleted}
          disabled={tasks.filter((t) => t.completed).length === 0}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: tasks.filter((t) => t.completed).length === 0 ? 0.5 : 1,
          }}
        >
          Clear Completed
        </button>
      </div>

      {/* Task List */}
      <div>
        <h2 style={{ color: '#555', marginBottom: '15px' }}>Tasks</h2>

        {getFilteredTasks().length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
            {tasks.length === 0
              ? 'No tasks yet. Add one above! 👆'
              : `No ${filter} tasks!`}
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {getFilteredTasks().map((t) => (
              <li
                key={t.id}
                style={{
                  backgroundColor: t.completed ? '#d4edda' : '#f0f0f0',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  fontSize: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                }}
              >
                {editingId === t.id ? (
                  // EDIT MODE
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
                      style={{
                        flex: 1,
                        padding: '8px',
                        fontSize: '16px',
                        border: '2px solid #4CAF50',
                        borderRadius: '4px',
                      }}
                    />
                    <button
                      onClick={() => saveEdit(t.id)}
                      style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '5px 15px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '5px 15px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  // NORMAL MODE
                  <>
                    <span
                      onClick={() => toggleComplete(t.id)}
                      style={{
                        textDecoration: t.completed ? 'line-through' : 'none',
                        color: t.completed ? '#6c757d' : '#000',
                        cursor: 'pointer',
                        flex: 1,
                      }}
                    >
                      {t.completed ? '✓ ' : ''}
                      {t.text}
                    </span>

                    <button
                      onClick={() => startEdit(t)}
                      disabled={t.completed}
                      style={{
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        padding: '5px 15px',
                        borderRadius: '4px',
                        cursor: t.completed ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        opacity: t.completed ? 0.5 : 1,
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTask(t.id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '5px 15px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
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
      <div
        style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid #ddd',
          textAlign: 'center',
          color: '#888',
          fontSize: '14px',
        }}
      >
        <p>Built with React • {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}

export default App;
