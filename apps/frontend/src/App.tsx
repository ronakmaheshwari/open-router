import { treaty } from "@elysiajs/eden/treaty2";
import "./index.css";
import type {App} from "primary-backend";
import SignupPage from "./pages/Signup";
import { BrowserRouter, Route, Routes } from "react-router";
import SigninPage from "./pages/Signin";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import backendUrl from "./config/env";
import Dashboard from "./pages/Dashboard";
import Credits from "./pages/Credits";
import Apikeys from "./pages/Apikeys";
import { AuthProvider } from "./providers/authContext";
import ProtectedRoute from "./components/custom/ProtectedRoute";

const client = treaty<App>(backendUrl)
const queryClient = new QueryClient()


export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>} 
            />
            <Route path="/credits" element={
              <ProtectedRoute>
                <Credits />
              </ProtectedRoute>
            } />
            <Route path="/api-keys" element={
              <ProtectedRoute>
                <Apikeys />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
