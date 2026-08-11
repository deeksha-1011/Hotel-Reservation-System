// Data management for the hotel booking website

// Initialize rooms data if not already in localStorage
function initializeRoomsData() {
  if (!localStorage.getItem('rooms')) {
    const rooms = [
      {
        id: 'room1',
        title: 'Standard Room',
        type: 'Standard',
        description: 'Comfortable room with essential amenities for a pleasant stay.',
        price: 89,
        capacity: 2,
        features: ['Queen Bed', 'Free WiFi', 'TV', 'Air Conditioning'],
        isAvailable: true
      },
      {
        id: 'room2',
        title: 'Deluxe Room',
        type: 'Deluxe',
        description: 'Spacious room with additional amenities for enhanced comfort.',
        price: 129,
        capacity: 2,
        features: ['King Bed', 'Free WiFi', 'TV', 'Air Conditioning', 'Mini Fridge'],
        isAvailable: true
      },
      {
        id: 'room3',
        title: 'Family Suite',
        type: 'Suite',
        description: 'Perfect for families with separate living area and extra space.',
        price: 179,
        capacity: 4,
        features: ['King Bed', 'Sofa Bed', 'Free WiFi', 'TV', 'Air Conditioning', 'Mini Kitchen'],
        isAvailable: true
      },
      {
        id: 'room4',
        title: 'Standard Twin',
        type: 'Standard',
        description: 'Comfortable room with two twin beds, ideal for friends or colleagues.',
        price: 99,
        capacity: 2,
        features: ['Twin Beds', 'Free WiFi', 'TV', 'Air Conditioning'],
        isAvailable: true
      },
      {
        id: 'room5',
        title: 'Executive Suite',
        type: 'Suite',
        description: 'Luxury suite with separate living room and premium amenities.',
        price: 249,
        capacity: 2,
        features: ['King Bed', 'Free WiFi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Work Desk'],
        isAvailable: true
      },
      {
        id: 'room6',
        title: 'Economy Single',
        type: 'Economy',
        description: 'Cozy room for solo travelers with all the essentials.',
        price: 69,
        capacity: 1,
        features: ['Single Bed', 'Free WiFi', 'TV', 'Air Conditioning'],
        isAvailable: true
      },
      {
        id: 'room7',
        title: 'Deluxe Twin',
        type: 'Deluxe',
        description: 'Spacious room with two comfortable beds and enhanced amenities.',
        price: 139,
        capacity: 2,
        features: ['Twin Beds', 'Free WiFi', 'TV', 'Air Conditioning', 'Mini Fridge'],
        isAvailable: true
      },
      {
        id: 'room8',
        title: 'Junior Suite',
        type: 'Suite',
        description: 'Elegant suite with additional living space and premium features.',
        price: 199,
        capacity: 2,
        features: ['King Bed', 'Free WiFi', 'TV', 'Air Conditioning', 'Seating Area', 'Work Desk'],
        isAvailable: true
      },
      {
        id: 'room9',
        title: 'Connecting Rooms',
        type: 'Standard',
        description: 'Two connected standard rooms, perfect for families or groups.',
        price: 179,
        capacity: 4,
        features: ['Two Queen Beds', 'Free WiFi', 'TV', 'Air Conditioning', 'Connecting Door'],
        isAvailable: true
      },
      {
        id: 'room10',
        title: 'Accessible Room',
        type: 'Standard',
        description: 'Specially designed room with accessibility features for all guests.',
        price: 89,
        capacity: 2,
        features: ['Queen Bed', 'Free WiFi', 'TV', 'Air Conditioning', 'Accessible Bathroom'],
        isAvailable: true
      },
      {
        id: 'room11',
        title: 'Premium King',
        type: 'Premium',
        description: 'Upgraded room with premium bedding and enhanced amenities.',
        price: 149,
        capacity: 2,
        features: ['King Bed', 'Free WiFi', 'Smart TV', 'Air Conditioning', 'Premium Toiletries'],
        isAvailable: true
      },
      {
        id: 'room12',
        title: 'Business Room',
        type: 'Business',
        description: 'Designed for business travelers with work area and high-speed internet.',
        price: 159,
        capacity: 1,
        features: ['Queen Bed', 'High-Speed WiFi', 'TV', 'Air Conditioning', 'Large Work Desk'],
        isAvailable: true
      },
      {
        id: 'room13',
        title: 'Grand Suite',
        type: 'Suite',
        description: 'Luxurious multi-room suite with upscale amenities and abundant space.',
        price: 299,
        capacity: 2,
        features: ['King Bed', 'Free WiFi', 'Smart TV', 'Air Conditioning', 'Separate Living Room', 'Dining Area'],
        isAvailable: true
      },
      {
        id: 'room14',
        title: 'Economy Double',
        type: 'Economy',
        description: 'Budget-friendly room with a comfortable double bed and essential amenities.',
        price: 79,
        capacity: 2,
        features: ['Double Bed', 'Free WiFi', 'TV', 'Air Conditioning'],
        isAvailable: true
      },
      {
        id: 'room15',
        title: 'Deluxe Triple',
        type: 'Deluxe',
        description: 'Spacious room with three beds, perfect for small groups or families.',
        price: 169,
        capacity: 3,
        features: ['Three Single Beds', 'Free WiFi', 'TV', 'Air Conditioning', 'Mini Fridge'],
        isAvailable: true
      },
      {
        id: 'room16',
        title: 'Honeymoon Suite',
        type: 'Suite',
        description: 'Romantic suite designed for couples celebrating special occasions.',
        price: 259,
        capacity: 2,
        features: ['King Bed', 'Free WiFi', 'Smart TV', 'Air Conditioning', 'Jacuzzi Tub', 'City View'],
        isAvailable: true
      },
      {
        id: 'room17',
        title: 'Penthouse Suite',
        type: 'Suite',
        description: 'Exclusive top-floor suite with premium amenities and spectacular views.',
        price: 399,
        capacity: 4,
        features: ['King Bed', 'Sofa Bed', 'Free WiFi', 'Smart TV', 'Air Conditioning', 'Full Kitchen', 'Panoramic View'],
        isAvailable: true
      },
      {
        id: 'room18',
        title: 'Standard Queen',
        type: 'Standard',
        description: 'Comfortable room with a queen bed and all essential amenities.',
        price: 89,
        capacity: 2,
        features: ['Queen Bed', 'Free WiFi', 'TV', 'Air Conditioning'],
        isAvailable: true
      },
      {
        id: 'room19',
        title: 'Premium Twin',
        type: 'Premium',
        description: 'Enhanced room with two premium beds and upgraded amenities.',
        price: 149,
        capacity: 2,
        features: ['Twin Beds', 'Free WiFi', 'Smart TV', 'Air Conditioning', 'Premium Toiletries'],
        isAvailable: true
      },
      {
        id: 'room20',
        title: 'Presidential Suite',
        type: 'Suite',
        description: 'The ultimate luxury experience with multiple rooms and exclusive features.',
        price: 499,
        capacity: 4,
        features: ['King Bed', 'Free WiFi', 'Smart TV', 'Air Conditioning', 'Living Room', 'Dining Area', 'Kitchenette', 'Private Balcony'],
        isAvailable: true
      }
    ];
    
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }
}

// Initialize bookings data if not already in localStorage
function initializeBookingsData() {
  if (!localStorage.getItem('bookings')) {
    localStorage.setItem('bookings', JSON.stringify([]));
  }
}

// Initialize data when page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeRoomsData();
  initializeBookingsData();
});

// Get all rooms
function getRooms() {
  const roomsJson = localStorage.getItem('rooms');
  return roomsJson ? JSON.parse(roomsJson) : [];
}

// Get a specific room by ID
function getRoomById(roomId) {
  const rooms = getRooms();
  return rooms.find(room => room.id === roomId);
}

// Update room availability
function updateRoomAvailability(roomId, isAvailable) {
  const rooms = getRooms();
  const roomIndex = rooms.findIndex(room => room.id === roomId);
  
  if (roomIndex !== -1) {
    rooms[roomIndex].isAvailable = isAvailable;
    localStorage.setItem('rooms', JSON.stringify(rooms));
    return true;
  }
  
  return false;
}

// Create a new booking
function createBooking(bookingData) {
  // Get current user
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'User not logged in' };
  }
  
  // Get room details
  const room = getRoomById(bookingData.roomId);
  if (!room) {
    return { success: false, message: 'Room not found' };
  }
  
  // Check if room is available
  if (!room.isAvailable) {
    return { success: false, message: 'Room is not available' };
  }
  
  // Calculate booking details
  const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
  const totalPrice = room.price * nights;
  
  // Create booking object
  const newBooking = {
    id: generateId(),
    userId: currentUser.id,
    roomId: bookingData.roomId,
    roomTitle: room.title,
    roomType: room.type,
    checkIn: bookingData.checkIn,
    checkOut: bookingData.checkOut,
    guests: bookingData.guests,
    nights: nights,
    pricePerNight: room.price,
    totalPrice: totalPrice,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  // Add to bookings array
  const bookingsJson = localStorage.getItem('bookings');
  const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];
  bookings.push(newBooking);
  
  // Save to localStorage
  localStorage.setItem('bookings', JSON.stringify(bookings));
  
  // Update room availability
  updateRoomAvailability(bookingData.roomId, false);
  
  return { success: true, booking: newBooking };
}

// Get all bookings for current user
function getUserBookings() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return [];
  }
  
  const bookingsJson = localStorage.getItem('bookings');
  const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];
  
  return bookings.filter(booking => booking.userId === currentUser.id);
}

// Cancel a booking
function cancelBooking(bookingId) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'User not logged in' };
  }
  
  const bookingsJson = localStorage.getItem('bookings');
  const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];
  
  const bookingIndex = bookings.findIndex(booking => 
    booking.id === bookingId && booking.userId === currentUser.id
  );
  
  if (bookingIndex === -1) {
    return { success: false, message: 'Booking not found' };
  }
  
  // Update booking status
  bookings[bookingIndex].status = 'cancelled';
  
  // Make room available again
  updateRoomAvailability(bookings[bookingIndex].roomId, true);
  
  // Save to localStorage
  localStorage.setItem('bookings', JSON.stringify(bookings));
  
  return { success: true };
}