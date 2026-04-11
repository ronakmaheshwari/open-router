import { treaty } from "@elysiajs/eden/treaty2";
import "./index.css";
import type {App} from "primary-backend";
import SignupPage from "./pages/Signup";
import { BrowserRouter, Route, Routes } from "react-router";
import SigninPage from "./pages/Signin";

const client = treaty<App>('localhost:3000')


export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
