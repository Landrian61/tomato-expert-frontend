import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import Index from "./pages/Dashboard";
import Diagnosis from "./pages/Diagnosis";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import DiagnosisDetail from "./pages/DiagnosisDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Analytics from "@/pages/Analytics";
import { useEffect } from "react";
import { testApiEndpoint } from "./utils/apiDebugger";
import "./utils/debugLocationService"; // Import for side effects
import "@/utils/locationDebugger"; // Import for side effects

const queryClient = new QueryClient();

const App = () => {
  // Debug tools setup
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "🔧 Development mode: API debugging tools available in console"
      );
      console.log('Try: window.testApiEndpoint("/environmental/latest")');
      console.log("Try: window.diagnoseFarmLocation() - Check location issues");
      console.log("Try: window.setTestFarmLocation() - Set test location");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>
          <AuthProvider>
            <NotificationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Protected routes that require authentication */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Index />} />
                    <Route path="/diagnosis" element={<Diagnosis />} />
                    <Route
                      path="/diagnosis/:id"
                      element={<DiagnosisDetail />}
                    />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route
                      path="/account/change-password"
                      element={<ChangePassword />}
                    />
                    <Route path="/analytics" element={<Analytics />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </NotificationProvider>
          </AuthProvider>
        </AppProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
