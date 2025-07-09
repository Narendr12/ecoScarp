# ReclaimRoute - Scrap Pickup Management System

A mobile-ready web application built with React and Capacitor for managing scrap pickup requests between customers and eco-warrior partners.

## 🚀 Features

### Customer App
- **Authentication**: Phone number + OTP login (mock OTP: 123456)
- **Dashboard**: Welcome screen with pickup scheduling and recent orders
- **Schedule Pickup**: Date/time selection, address input, optional map link
- **Order History**: View all pickup requests with real-time status updates
- **Pickup Code**: Unique code displayed for partner verification
- **Approval Interface**: Review and approve partner-submitted item details

### Partner App
- **Authentication**: Phone number + OTP login (mock OTP: 123456)
- **Dashboard**: View available and assigned pickup requests
- **Pickup Management**: Accept requests and manage workflow
- **Code Verification**: Enter customer pickup code to start process
- **Item Entry**: Add scrap item details (name, quantity, price)
- **Status Updates**: Progress requests through 5-stage lifecycle

## 📱 Pickup Request Lifecycle

1. **Pending** - Customer schedules pickup
2. **Accepted** - Partner accepts the request
3. **In-Process** - Partner enters pickup code at location
4. **Pending Approval** - Partner submits item details for review
5. **Completed** - Customer approves the pickup details

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Mobile**: Capacitor (iOS & Android support)
- **UI**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API
- **Navigation**: React Router DOM
- **Storage**: LocalStorage for data persistence
- **Icons**: Lucide React

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd reclaim-route-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open http://localhost:8080 in your browser
   - Choose between Customer App or Partner App

## 📲 Mobile Deployment

### Web Preview
The app is mobile-optimized and works perfectly in browser mobile view.

### Native Mobile Apps

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Add mobile platforms**
   ```bash
   npx cap add ios
   npx cap add android
   ```

3. **Sync with native platforms**
   ```bash
   npx cap sync
   ```

4. **Run on device/emulator**
   ```bash
   # For Android
   npx cap run android
   
   # For iOS (macOS with Xcode required)
   npx cap run ios
   ```

## 🧪 Testing Credentials

**Mock OTP for all users**: `123456`

### Test Flow
1. Choose Customer or Partner app
2. Enter any phone number
3. Use OTP: 123456
4. Explore the features!

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx
│   ├── customer/
│   │   ├── CustomerDashboard.tsx
│   │   ├── OrderHistory.tsx
│   │   └── SchedulePickup.tsx
│   ├── partner/
│   │   ├── ManagePickup.tsx
│   │   └── PartnerDashboard.tsx
│   ├── ui/                 # shadcn/ui components
│   └── AppSelector.tsx
├── contexts/
│   ├── AuthContext.tsx     # Authentication state
│   └── PickupContext.tsx   # Pickup requests state
├── types/
│   └── pickup.ts           # TypeScript interfaces
└── App.tsx
```

## 🎨 Design System

- Uses semantic color tokens from Tailwind config
- Mobile-first responsive design
- Consistent spacing and typography
- Accessibility-focused components

## 🔧 Backend Simulation

The app uses local state management and localStorage to simulate backend functionality:
- User authentication state
- Pickup requests storage
- Real-time updates between Customer and Partner views

## 🚀 Deployment Options

1. **Vercel/Netlify**: Deploy the `dist` folder
2. **Mobile App Stores**: Use Capacitor build process

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
