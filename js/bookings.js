// Bookings functionality for the hotel booking website

// Display user bookings
function displayBookings() {
  const bookingsContainer = document.getElementById('bookings-container');
  if (!bookingsContainer) return;
  
  const bookings = getUserBookings();
  
  // Clear loading message
  bookingsContainer.innerHTML = '';
  
  if (bookings.length === 0) {
    bookingsContainer.innerHTML = '<div class="no-bookings">You have no bookings yet</div>';
    return;
  }
  
  // Sort bookings by creation date (newest first)
  bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Create and append booking cards
  bookings.forEach(booking => {
    const bookingCard = createBookingCard(booking);
    bookingsContainer.appendChild(bookingCard);
  });
  
  // Add event listeners for cancel buttons
  setupCancelButtons();
}

// Create a booking card element
function createBookingCard(booking) {
  const card = document.createElement('div');
  card.className = 'booking-card';
  
  const statusClass = `status-${booking.status.toLowerCase()}`;
  
  card.innerHTML = `
    <div class="booking-header">
      <span class="booking-id">Booking #${booking.id.substring(0, 8)}</span>
      <span class="booking-status ${statusClass}">${booking.status}</span>
    </div>
    <div class="booking-content">
      <h3 class="booking-room-title">${booking.roomTitle}</h3>
      
      <div class="booking-details">
        <div class="booking-detail-group">
          <h4>Check In</h4>
          <p class="booking-detail-value">${formatDate(booking.checkIn)}</p>
        </div>
        
        <div class="booking-detail-group">
          <h4>Check Out</h4>
          <p class="booking-detail-value">${formatDate(booking.checkOut)}</p>
        </div>
        
        <div class="booking-detail-group">
          <h4>Guests</h4>
          <p class="booking-detail-value">${booking.guests}</p>
        </div>
        
        <div class="booking-detail-group">
          <h4>Length of Stay</h4>
          <p class="booking-detail-value">${booking.nights} night${booking.nights !== 1 ? 's' : ''}</p>
        </div>
      </div>
      
      <div class="booking-price">
        Total: ${formatCurrency(booking.totalPrice)}
      </div>
      
      ${booking.status === 'confirmed' ? `
        <div class="booking-actions">
          <button class="btn btn-danger cancel-booking" data-booking-id="${booking.id}">Cancel Booking</button>
        </div>
      ` : ''}
    </div>
  `;
  
  return card;
}

// Setup cancel booking buttons
function setupCancelButtons() {
  const cancelButtons = document.querySelectorAll('.cancel-booking');
  
  cancelButtons.forEach(button => {
    button.addEventListener('click', function() {
      const bookingId = this.getAttribute('data-booking-id');
      
      if (confirm('Are you sure you want to cancel this booking?')) {
        const result = cancelBooking(bookingId);
        
        if (result.success) {
          showMessage('Booking cancelled successfully', 'success');
          
          // Reload bookings to update display
          setTimeout(() => {
            displayBookings();
          }, 1000);
        } else {
          showMessage(result.message, 'error');
        }
      }
    });
  });
}