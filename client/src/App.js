import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Demo from './components/auth/ReactLogin';
import Home from "./views/Home";
import { AuthProvider } from "./context/AuthContext";
// import LandingPage from "./views/Landing";
import SignupPage from "./views/Signup";
import AdminPage from "./views/Admin";
import Login from "./views/Login";
// import InterviewPage from "./views/Interview";
import ThankYouPage from "./views/ThankYouPage";
import { NextUIProvider } from "@nextui-org/react";
import Jobs from "./views/Jobs";
import VideoRecorder from "./components/VideoRecorder";
import NewInterview from "./views/NewInterview";
import LandingPage from "./components/Test";
import LandingTest from "./components/LandingTest"
import VerificationPage from "./views/Verification";
import VerifyEmailPrompt from "./views/VerifyEmail";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import SidebarDemo from "./views/SidebarDemo";
import UploadResume from "./views/UploadResume";

function App() {
  return (
    <AuthProvider>
      <NextUIProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingTest />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/test" element={<VideoRecorder />} />
            {/* <Route path="/login" element={<Demo />} /> */}
            <Route path="/home" element={<Home />} />
            {/* <Route path="/interview" element={<InterviewPage />} /> */}
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/new-interview" element={<NewInterview />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/verify-email-prompt" element={<VerifyEmailPrompt />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<SidebarDemo />} />
            <Route path="/uploadResume" element={<UploadResume />} />
          </Routes>
        </BrowserRouter>
      </NextUIProvider>
      {/* <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8"> */}

      {/* </div>
    </div> */}
    </AuthProvider>
  );
}

export default App;
