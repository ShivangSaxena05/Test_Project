// Mock API service - simulates backend without actual server
// Uses localStorage for data persistence

const API_DELAY = 500; // Simulate network delay

// Helper to simulate async API calls
const mockRequest = (data, shouldFail = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Mock error'));
      } else {
        resolve(data);
      }
    }, API_DELAY);
  });
};

// Initialize mock data in localStorage if not present
export const initializeMockData = () => {
  if (typeof window === 'undefined') return;
  
  // Initialize users if not present
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
      { id: '1', email: 'admin@teja.com', password: 'admin123', name: 'Admin User', role: 'admin' },
      { id: '2', email: 'intern@teja.com', password: 'intern123', name: 'Test Intern', role: 'intern' }
    ]));
  }
  
  // Initialize tasks if not present
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify([
      {
        id: '1',
        title: 'Translate English to Spanish Document',
        description: 'Translate a 10-page business document from English to Spanish',
        status: 'pending',
        priority: 'high',
        deadline: '2026-02-25',
        assignedTo: null,
        createdAt: '2026-02-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Audio Transcription - Meeting Recording',
        description: 'Transcribe a 1-hour meeting recording to text',
        status: 'in_progress',
        priority: 'medium',
        deadline: '2026-02-28',
        assignedTo: '2',
        createdAt: '2026-02-14T09:00:00Z'
      },
      {
        id: '3',
        title: 'Voice Over - Promotional Video',
        description: 'Record voice over for a 2-minute promotional video',
        status: 'completed',
        priority: 'low',
        deadline: '2026-02-20',
        assignedTo: '2',
        createdAt: '2026-02-10T08:00:00Z'
      }
    ]));
  }
};

// Get current user from localStorage
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// Login function
export const login = async (email, password) => {
  initializeMockData();
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return mockRequest(userWithoutPassword);
  }
  
  return mockRequest(null, true).catch(() => {
    throw new Error('Invalid email or password');
  });
};

// Logout function
export const logout = async () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('currentUser');
  return mockRequest({ success: true });
};

// Register function
export const register = async (userData) => {
  initializeMockData();
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Check if user already exists
  if (users.find(u => u.email === userData.email)) {
    return mockRequest(null, true).catch(() => {
      throw new Error('User already exists');
    });
  }
  
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    role: 'intern'
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  const { password: _, ...userWithoutPassword } = newUser;
  localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  
  return mockRequest(userWithoutPassword);
};

// Get all tasks
export const getTasks = async () => {
  initializeMockData();
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  return mockRequest(tasks);
};

// Get task by ID
export const getTaskById = async (id) => {
  initializeMockData();
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const task = tasks.find(t => t.id === id);
  
  if (task) {
    return mockRequest(task);
  }
  
  return mockRequest(null, true).catch(() => {
    throw new Error('Task not found');
  });
};

// Create task
export const createTask = async (taskData) => {
  initializeMockData();
  
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const newTask = {
    id: Date.now().toString(),
    ...taskData,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  
  return mockRequest(newTask);
};

// Update task
export const updateTask = async (id, updates) => {
  initializeMockData();
  
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return mockRequest(null, true).catch(() => {
      throw new Error('Task not found');
    });
  }
  
  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  localStorage.setItem('tasks', JSON.stringify(tasks));
  
  return mockRequest(tasks[taskIndex]);
};

// Delete task
export const deleteTask = async (id) => {
  initializeMockData();
  
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const filteredTasks = tasks.filter(t => t.id !== id);
  localStorage.setItem('tasks', JSON.stringify(filteredTasks));
  
  return mockRequest({ success: true });
};

// Get tasks for current user (intern)
export const getMyTasks = async () => {
  const user = getCurrentUser();
  if (!user) return mockRequest([]);
  
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const myTasks = tasks.filter(t => t.assignedTo === user.id);
  
  return mockRequest(myTasks);
};

// Assign task to user
export const assignTask = async (taskId, userId) => {
  return updateTask(taskId, { assignedTo: userId, status: 'in_progress' });
};

