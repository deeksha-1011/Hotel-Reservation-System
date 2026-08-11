// Authentication functionality for the hotel booking website

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

// Update navigation based on authentication status
function updateNavigation() {
  const loginLink = document.getElementById('login-link');
  const signupLink = document.getElementById('signup-link');
  const logoutLink = document.getElementById('logout-link');
  const myBookingsLink = document.getElementById('my-bookings-link');
  
  if (isLoggedIn()) {
    loginLink.classList.add('hidden');
    signupLink.classList.add('hidden');
    logoutLink.classList.remove('hidden');
    if (myBookingsLink) {
    myBookingsLink.classList.remove('hidden');
    }
  } else {
    loginLink.classList.remove('hidden');
    signupLink.classList.remove('hidden');
    logoutLink.classList.add('hidden');
    if (myBookingsLink) {
    myBookingsLink.classList.add('hidden');
  }
}

  // Add logout handler
  logoutLink.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

// Get user data
function getUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Login function
function login(email, password) {
  // Get all users from localStorage
  const usersJson = localStorage.getItem('users');
  const users = usersJson ? JSON.parse(usersJson) : [];
  
  // Find user with matching email
  const user = users.find(u => u.email === email);
  
  if (!user) {
    showMessage('User not found', 'error');
    return false;
  }
  
  // Check password
  if (user.password !== password) {
    showMessage('Incorrect password', 'error');
    return false;
  }
  
  // Set current user in localStorage (without password)
  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem('token', userWithoutPassword.token);
  localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  
  showMessage('Login successful', 'success');
  
  // Redirect to home page after login
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
  
  return true;
}

// Signup function
function signup(name, email, password) {
  // Get all users from localStorage
  const usersJson = localStorage.getItem('users');
  const users = usersJson ? JSON.parse(usersJson) : [];
  
  // Check if user with this email already exists
  if (users.some(u => u.email === email)) {
    showMessage('User with this email already exists', 'error');
    return false;
  }
  
  // Create new user object
  const newUser = {
    id: generateId(),
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  };
  
  // Add to users array and save to localStorage
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Set current user in localStorage (without password)
  const { password: _, ...userWithoutPassword } = newUser;
  localStorage.setItem('token', userWithoutPassword.token);
  localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  
  showMessage('Account created successfully', 'success');
  
  // Redirect to home page after signup
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
  
  return true;
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('currentUser');
  showMessage('Logged out successfully', 'info');
  
  // Redirect to home page after logout
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
  
  return true;
}