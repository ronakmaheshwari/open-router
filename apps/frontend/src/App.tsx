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

const client = treaty<App>(backendUrl)
const queryClient = new QueryClient()


export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
