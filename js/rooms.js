// Rooms functionality for the hotel booking website

// Display all rooms
function displayRooms() {
  const roomsContainer = document.getElementById('rooms-container');
  if (!roomsContainer) return;
  
  const rooms = getRooms();
  
  // Clear loading message
  roomsContainer.innerHTML = '';
  
  if (rooms.length === 0) {
    roomsContainer.innerHTML = '<p class="no-rooms">No rooms available</p>';
    return;
  }
  
  // Create and append room cards
  rooms.forEach(room => {
    const roomCard = createRoomCard(room);
    roomsContainer.appendChild(roomCard);
  });
  
  // Set up booking modal functionality
  setupBookingModal();
}

// Create a room card element
function createRoomCard(room) {
  const card = document.createElement('div');
  card.className = 'room-card';
  
  const statusClass = room.isAvailable ? 'status-available' : 'status-booked';
  const statusText = room.isAvailable ? 'Available' : 'Booked';
  
  card.innerHTML = `
    <div class="room-placeholder">Room ${room.id.replace('room', '')}</div>
    <div class="room-content">
      <div class="room-title">${room.title}</div>
      <div class="room-type">${room.type}</div>
      <p class="room-description">${room.description}</p>
      
      <div class="room-features">
        <div class="room-features-title">Features</div>
        <div class="feature-list">
          ${room.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
        </div>
      </div>
      
      <div class="room-price">
        <div>
          <span class="price">${formatCurrency(room.price)}</span>
          <span class="price-per-night">per night</span>
        </div>
        <span class="status-badge ${statusClass}">${statusText}</span>
      </div>
      
      ${room.isAvailable ? 
        `<button class="btn btn-primary btn-block book-btn" data-room-id="${room.id}">Book Now</button>` : 
        `<button class="btn btn-secondary btn-block" disabled>Not Available</button>`
      }
    </div>
  `;
  
  return card;
}

// Setup booking modal
function setupBookingModal() {
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.querySelector('.close-modal');
  const bookingForm = document.getElementById('booking-form');
  
  if (!modal || !closeBtn || !bookingForm) return;
  
  // Get all book buttons
  const bookButtons = document.querySelectorAll('.book-btn');
  
  // Add click event to each book button
  bookButtons.forEach(button => {
    button.addEventListener('click', function() {
      const roomId = this.getAttribute('data-room-id');
      openBookingModal(roomId);
    });
  });
  
  // Close modal on click outside or on close button
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Handle booking form submission
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check if user is logged in
    if (!isLoggedIn()) {
      showMessage('Please login to book a room', 'error');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
      return;
    }
    
    const roomId = document.getElementById('room-id').value;
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = document.getElementById('guests').value;
    
    // Validate form fields
    if (!roomId || !checkIn || !checkOut || !guests) {
      showMessage('Please fill in all fields', 'error');
      return;
    }
    
    // Create booking
    const result = createBooking({
      roomId,
      checkIn,
      checkOut,
      guests
    });
    
    if (result.success) {
      showMessage('Room booked successfully', 'success');
      modal.style.display = 'none';
      
      // Reload rooms to update availability
      setTimeout(() => {
        displayRooms();
      }, 1000);
    } else {
      showMessage(result.message, 'error');
    }
  });
  
  // Set minimum dates for date inputs
  setMinDatesForInputs();
}

// Open booking modal with room details
function openBookingModal(roomId) {
  const modal = document.getElementById('booking-modal');
  const roomDetails = document.getElementById('room-details');
  const roomIdInput = document.getElementById('room-id');
  
  if (!modal || !roomDetails || !roomIdInput) return;
  
  const room = getRoomById(roomId);
  if (!room) {
    showMessage('Room not found', 'error');
    return;
  }
  
  // Set room ID in hidden input
  roomIdInput.value = roomId;
  
  // Display room details in modal
  roomDetails.innerHTML = `
    <h3>${room.title}</h3>
    <p>Type: ${room.type}</p>
    <p>Max Guests: ${room.capacity}</p>
    <p>Price per night: ${formatCurrency(room.price)}</p>
  `;
  
  // Show modal
  modal.style.display = 'block';
  
  // Set up date inputs event listeners for price calculation
  const checkInInput = document.getElementById('check-in');
  const checkOutInput = document.getElementById('check-out');
  
  const updateTotalPrice = function() {
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;
    
    if (checkIn && checkOut) {
      const nights = calculateNights(checkIn, checkOut);
      const totalPrice = room.price * nights;
      
      // Update or add total price element
      let totalPriceEl = document.querySelector('.total-price');
      if (!totalPriceEl) {
        totalPriceEl = document.createElement('div');
        totalPriceEl.className = 'total-price';
        roomDetails.appendChild(totalPriceEl);
      }
      
      totalPriceEl.textContent = `Total for ${nights} nights: ${formatCurrency(totalPrice)}`;
    }
  };
  
  checkInInput.addEventListener('change', updateTotalPrice);
  checkOutInput.addEventListener('change', updateTotalPrice);
}