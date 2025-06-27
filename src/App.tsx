
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthRoute from "./components/auth/AuthRoute";
import Index from "./pages/Index";
import RunsPage from "./pages/RunsPage";
import RunDetailPage from "./pages/RunDetailPage";
import MyRunsPage from "./pages/MyRunsPage";
import BusinessHomePage from "./pages/business/BusinessHomePage";
import BusinessProfilePage from "./pages/business/BusinessProfilePage";
import PublicBusinessProfilePage from "./pages/PublicBusinessProfilePage";
import CreateRunPage from "./pages/business/CreateRunPage";
import AllParticipantsPage from "./pages/business/AllParticipantsPage";
import LoginPage from "./pages/auth/LoginPage";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage";
import UserHomePage from "./pages/UserHomePage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import { useScrollToTop } from "./hooks/useScrollToTop";

const queryClient = new QueryClient();

// Component to handle conditional redirects based on user role
const HomeRedirect = () => {
  const { user, isLoading } = useAuth();
  
  console.log('HomeRedirect: user =', user);
  console.log('HomeRedirect: isLoading =', isLoading);
  console.log('HomeRedirect: user role =', user?.role);
  
  // Show loading while checking auth state
  if (isLoading) {
    console.log('HomeRedirect: Still loading, showing loading...');
    return <div>Loading...</div>;
  }
  
  if (!user) {
    console.log('HomeRedirect: No user, showing Index page');
    return <Index />;
  }
  
  if (user.role === 'business') {
    console.log('HomeRedirect: Business user detected, redirecting to /business/home');
    return <Navigate to="/business/home" replace />;
  }
  
  if (user.role === 'runner') {
    console.log('HomeRedirect: Runner user detected, redirecting to /user-home');
    return <Navigate to="/user-home" replace />;
  }
  
  console.log('HomeRedirect: Unknown role or no role, showing Index page');
  return <Index />;
};

// Component to handle scroll-to-top on route changes - this needs to be inside AuthProvider
const AppRoutes = () => {
  useScrollToTop();
  
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/runs" element={<RunsPage />} />
      <Route path="/runs/:id" element={<RunDetailPage />} />
      <Route path="/business/:businessId/profile" element={<PublicBusinessProfilePage />} />
      <Route 
        path="/user-home" 
        element={
          <AuthRoute requiredRole="runner">
            <UserHomePage />
          </AuthRoute>
        } 
      />
      <Route 
        path="/my-runs" 
        element={
          <AuthRoute requiredRole="runner">
            <MyRunsPage />
          </AuthRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <AuthRoute>
            <ProfilePage />
          </AuthRoute>
        } 
      />
      <Route 
        path="/business/home" 
        element={
          <AuthRoute requiredRole="business">
            <BusinessHomePage />
          </AuthRoute>
        } 
      />
      <Route 
        path="/business/profile" 
        element={
          <AuthRoute requiredRole="business">
            <BusinessProfilePage />
          </AuthRoute>
        } 
      />
      <Route 
        path="/business/create-run" 
        element={
          <AuthRoute requiredRole="business">
            <CreateRunPage />
          </AuthRoute>
        } 
      />
      <Route 
        path="/business/all-participants" 
        element={
          <AuthRoute requiredRole="business">
            <AllParticipantsPage />
          </AuthRoute>
        } 
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
