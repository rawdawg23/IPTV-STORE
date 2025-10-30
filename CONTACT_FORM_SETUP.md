# Contact Form Database Integration

This document explains how the ContactUs page is now connected to the database.

## Features Added

### Backend (Server)

1. **Contact Model** (`Server/models/Contact.js`)

   - Stores: name, email, message, status, IP address, user agent
   - Includes timestamps and database indexes for performance
   - Status tracking: pending, read, replied

2. **Contact Routes** (`Server/routes/contacts.js`)

   - `POST /api/contacts` - Submit new contact form
   - `GET /api/contacts` - Fetch all contacts (with pagination)
   - `GET /api/contacts/:id` - Fetch single contact
   - `PATCH /api/contacts/:id` - Update contact status
   - `DELETE /api/contacts/:id` - Delete contact

3. **Server Integration** (`Server/server.js`)
   - Added contact routes to the main server

### Frontend (Client)

1. **ContactUs Component** (`Client/src/client/ContactUs.jsx`)

   - Real API integration instead of mock submission
   - Error handling and display
   - Loading states
   - Form validation feedback

2. **Admin Panel** (`Client/src/client/AdminPanel.jsx`)
   - Tabbed interface for channel and contact management
   - View all contact submissions
   - Update contact status (pending/read/replied)
   - Delete contacts
   - Pagination support

## Setup Instructions

### 1. Environment Variables

Make sure your `.env` file in the Server directory has:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 2. Start the Server

```bash
cd Server
npm install
npm start
```

### 3. Start the Client

```bash
cd Client
npm install
npm start
```

## API Endpoints

### Submit Contact Form

```
POST /api/contacts
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I have a question about your IPTV service."
}
```

### Get All Contacts (Admin)

```
GET /api/contacts?page=1&limit=10&status=pending
```

### Update Contact Status

```
PATCH /api/contacts/:id
Content-Type: application/json

{
  "status": "read"
}
```

### Delete Contact

```
DELETE /api/contacts/:id
```

## Database Schema

```javascript
{
  name: String (required),
  email: String (required, validated),
  message: String (required),
  status: String (enum: "pending", "read", "replied"),
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Features

- ✅ Real-time form submission to database
- ✅ Email validation
- ✅ Error handling and user feedback
- ✅ Admin panel for managing submissions
- ✅ Status tracking (pending/read/replied)
- ✅ Pagination for large datasets
- ✅ IP address and user agent logging
- ✅ Responsive design
- ✅ Loading states and animations

## Security Considerations

- Input validation on both frontend and backend
- Email format validation
- XSS protection through proper escaping
- Rate limiting (can be added if needed)
- Admin authentication (should be implemented)

## Next Steps

1. Add authentication for admin panel
2. Implement email notifications for new submissions
3. Add search and filter functionality
4. Add export functionality for contact data
5. Implement rate limiting for form submissions
