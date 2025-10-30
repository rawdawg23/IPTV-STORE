# IPTV Application Database Integration Guide

This guide documents the complete database integration for all client pages in the IPTV application.

## 🗄️ **Database Models**

### 1. **User Model** (`Server/models/User.js`)

- **Purpose**: User authentication, registration, and profile management
- **Fields**: name, email, password, avatar, plan, subscription status, watch history, devices, notifications, settings
- **Features**: Password hashing, JWT authentication, profile management

### 2. **Contact Model** (`Server/models/Contact.js`)

- **Purpose**: Contact form submissions
- **Fields**: name, email, message, status, IP address, user agent
- **Features**: Status tracking (pending/read/replied), admin management

### 3. **Subscription Model** (`Server/models/Subscription.js`)

- **Purpose**: Subscription plans and billing management
- **Fields**: userId, plan, billing cycle, amount, status, features, payment history
- **Features**: Plan hierarchy, trial management, payment tracking

### 4. **Trial Model** (`Server/models/Trial.js`)

- **Purpose**: Free trial registrations and tracking
- **Fields**: name, email, phone, plan, status, conversion tracking
- **Features**: Trial activation, conversion tracking, analytics

### 5. **Channel Model** (`Server/models/Channel.js`)

- **Purpose**: IPTV channel management
- **Fields**: name, url, categories, language, logo, viewers, premium status
- **Features**: Category filtering, premium content management

## 🔌 **API Routes**

### Authentication Routes (`/api/auth`)

- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /devices` - Add device
- `DELETE /devices/:deviceId` - Remove device
- `POST /notifications/:id/read` - Mark notification as read

### Contact Routes (`/api/contacts`)

- `POST /` - Submit contact form
- `GET /` - Get all contacts (admin)
- `GET /:id` - Get single contact
- `PATCH /:id` - Update contact status
- `DELETE /:id` - Delete contact

### Trial Routes (`/api/trials`)

- `POST /` - Register for free trial
- `GET /status/:email` - Get trial status
- `PUT /:id/activate` - Activate trial
- `PUT /:id/convert` - Convert trial to subscription
- `GET /` - Get all trials (admin)
- `GET /stats` - Get trial statistics
- `DELETE /:id` - Delete trial

### Subscription Routes (`/api/subscriptions`)

- `GET /` - Get user subscription
- `POST /` - Create subscription
- `PUT /upgrade` - Upgrade subscription
- `PUT /cancel` - Cancel subscription
- `PUT /reactivate` - Reactivate subscription
- `GET /history` - Get payment history
- `GET /admin` - Get all subscriptions (admin)
- `GET /admin/stats` - Get subscription statistics

### Channel Routes (`/api/channels`)

- `GET /` - Get all channels
- `POST /` - Create channel
- `PATCH /:id` - Update channel
- `DELETE /:id` - Delete channel

## 📱 **Client Page Integrations**

### 1. **Login/Register Page** (`login-regiser.jsx`)

✅ **Connected Features:**

- User registration with validation
- User login with JWT authentication
- Error handling and success messages
- Token storage in localStorage
- Automatic redirect after successful login

### 2. **Contact Us Page** (`ContactUs.jsx`)

✅ **Connected Features:**

- Contact form submission to database
- Email validation
- Error handling and user feedback
- Admin panel integration for managing submissions

### 3. **Free Trial Page** (`FreeTrial.jsx`)

✅ **Connected Features:**

- Trial registration form
- Plan selection
- Email validation
- Success/error messaging
- Admin panel integration

### 4. **Profile Page** (`profile.jsx`)

✅ **Connected Features:**

- Real user data from database
- Authentication check
- Profile management
- Device management
- Notification handling
- Subscription status display

### 5. **Pricing Page** (`pricing.jsx`)

✅ **Connected Features:**

- Subscription creation
- Plan selection
- Authentication check
- Payment integration (framework ready)
- Redirect to profile after subscription

### 6. **IPTV Channels Page** (`IPTVCHANNELS.jsx`)

✅ **Connected Features:**

- Channel data from database
- Category filtering
- Search functionality
- Premium content display
- Channel details modal

### 7. **Admin Panel** (`AdminPanel.jsx`)

✅ **Connected Features:**

- Contact submissions management
- Trial registrations management
- Subscription management
- Channel management
- Status updates and deletions
- Pagination support

## 🔧 **Setup Instructions**

### 1. **Install Dependencies**

```bash
cd Server
npm install bcryptjs jsonwebtoken
```

### 2. **Environment Variables**

Create `.env` file in Server directory:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 3. **Start the Application**

```bash
# Start Server
cd Server
npm start

# Start Client (in another terminal)
cd Client
npm start
```

## 🔐 **Security Features**

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication
- **Input Validation**: Server-side validation for all forms
- **Email Validation**: Proper email format checking
- **XSS Protection**: Input sanitization
- **Rate Limiting**: Ready for implementation

## 📊 **Admin Features**

### Contact Management

- View all contact submissions
- Update status (pending/read/replied)
- Delete submissions
- Pagination support

### Trial Management

- View all trial registrations
- Update trial status
- Track conversions
- Analytics and statistics

### Subscription Management

- View all subscriptions
- Track payment history
- Monitor subscription status
- Revenue analytics

### Channel Management

- Add/edit/delete channels
- Category management
- Premium content flags
- Viewer tracking

## 🚀 **Features Implemented**

### ✅ **Authentication System**

- User registration and login
- JWT token management
- Password hashing
- Profile management

### ✅ **Contact System**

- Contact form submissions
- Admin management
- Status tracking
- Email validation

### ✅ **Trial System**

- Free trial registrations
- Trial activation
- Conversion tracking
- Analytics dashboard

### ✅ **Subscription System**

- Plan management
- Billing cycles
- Payment tracking
- Upgrade/downgrade functionality

### ✅ **Channel System**

- Channel management
- Category filtering
- Premium content
- Search functionality

### ✅ **Admin Dashboard**

- Multi-tab interface
- Data management
- Statistics and analytics
- Bulk operations

## 🔄 **Data Flow**

1. **User Registration** → User Model → Subscription Model (trial)
2. **Contact Form** → Contact Model → Admin Panel
3. **Trial Registration** → Trial Model → Admin Panel
4. **Plan Selection** → Subscription Model → User Model
5. **Channel Viewing** → Channel Model → User Watch History

## 📈 **Analytics & Reporting**

- Contact submission tracking
- Trial conversion rates
- Subscription revenue
- Channel popularity
- User engagement metrics

## 🔮 **Future Enhancements**

1. **Payment Gateway Integration**

   - Stripe/PayPal integration
   - Automated billing
   - Payment failure handling

2. **Email Notifications**

   - Welcome emails
   - Trial expiration reminders
   - Payment confirmations

3. **Advanced Analytics**

   - User behavior tracking
   - Content recommendations
   - Revenue optimization

4. **Mobile App Integration**
   - Push notifications
   - Offline viewing
   - Mobile-specific features

## 🛠️ **Troubleshooting**

### Common Issues:

1. **MongoDB Connection**: Ensure MONGO_URI is correct
2. **JWT Errors**: Check JWT_SECRET is set
3. **CORS Issues**: Verify CORS is enabled
4. **Authentication**: Clear localStorage if token issues

### Testing:

- Test all forms with validation
- Verify admin panel functionality
- Check authentication flow
- Test error handling

This comprehensive database integration provides a full-featured IPTV application with user management, content delivery, and administrative capabilities.
