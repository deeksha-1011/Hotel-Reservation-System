// Utility functions for the hotel booking website

// Display toast messages (success, error, info)
function showMessage(message, type = 'info') {
  // Remove any existing toasts
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create new toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  // Add to body
  document.body.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Format date for display
function formatDate(dateString) {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
}

// Calculate number of nights between two dates
function calculateNights(checkIn, checkOut) {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Set minimum date for date inputs to today
function setMinDatesForInputs() {
  const today = new Date().toISOString().split('T')[0];
  const checkInInput = document.getElementById('check-in');
  const checkOutInput = document.getElementById('check-out');
  
  if (checkInInput) {
    checkInInput.min = today;
    
    // When check-in date changes, update check-out minimum date
    checkInInput.addEventListener('change', function() {
      if (checkOutInput) {
        checkOutInput.min = checkInInput.value;
        
        // If check-out date is before check-in date, reset it
        if (checkOutInput.value && checkOutInput.value < checkInInput.value) {
          checkOutInput.value = '';
        }
      }
    });
  }
  
  if (checkOutInput && !checkOutInput.min) {
    checkOutInput.min = today;
  }
}