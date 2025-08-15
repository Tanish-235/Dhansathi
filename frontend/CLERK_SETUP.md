# Clerk Authentication Setup

This frontend now includes Clerk authentication for user management.

## 🚀 Setup Steps

### 1. **Get Clerk Publishable Key**
1. Go to [clerk.com](https://clerk.com)
2. Create an account and new application
3. Copy your **Publishable Key** from the dashboard

### 2. **Create Environment File**
Create a `.env` file in your `frontend` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_API_URL=http://localhost:5000
```

### 3. **Start Your Frontend**
```bash
cd frontend
npm run dev
```

## 🔐 Features Implemented

### **Authentication Components:**
- ✅ **Sign In Button** - Modal-based sign in
- ✅ **User Button** - User profile and sign out
- ✅ **Protected Routes** - Secure certain pages
- ✅ **Authentication Status** - Show user info

### **Protected Pages:**
- 🔒 **Budget Planner** (`/budgetplan`) - Requires sign in
- 🔒 **Sathi Bot** (`/chat`) - Requires sign in

### **Public Pages:**
- 🌐 **Home** (`/`) - No authentication required
- 🌐 **Tutorials** (`/tutorials`) - No authentication required
- 🌐 **Resources** (`/resources`) - No authentication required

## 🎯 How It Works

### **For Unauthenticated Users:**
- See "Sign In" button in navbar
- Can access public pages
- Get redirected to sign-in modal for protected pages

### **For Authenticated Users:**
- See user profile button in navbar
- Can access all pages including protected ones
- Personalized welcome message on home page

## 🛠️ Customization

### **Add More Protected Routes:**
```jsx
<Route path="/protected-page" element={
  <ProtectedRoute>
    <YourComponent />
  </ProtectedRoute>
} />
```

### **Use Authentication in Components:**
```jsx
import { useAuth } from '../hooks/useAuth.jsx';

const MyComponent = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }
  
  return (
    <div>
      Welcome, {user.fullName}!
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};
```

## 🔧 Troubleshooting

### **"Missing Publishable Key" Error:**
- Check your `.env` file exists
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is set correctly
- Restart your development server

### **Authentication Not Working:**
- Ensure Clerk application is properly configured
- Check browser console for errors
- Verify environment variables are loaded

## 📱 User Experience

- **Seamless Sign In** - Modal-based authentication
- **Persistent Sessions** - Users stay signed in
- **Responsive Design** - Works on all devices
- **Modern UI** - Clean, professional appearance

Your Dhansathi application now has enterprise-grade authentication! 🎉
