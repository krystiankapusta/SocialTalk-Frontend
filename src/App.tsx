import "./App.css";
import { Route, Routes } from "react-router-dom";
import Resend from "./Components/Resend/Resend";
import AddFriendPage from "./pages/AddFriendPage/AddFriendPage";
import HomePage from "./pages/HomePage/HomePage";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import ChatPage from "./pages/ChatPage/ChatPage";
import NotFound from "./pages/NotFound/NotFound";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import VerifyAccountPage from "./pages/VerifyAccountPage/VerifyAccountPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage/ResetPasswordPage";

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<HomePage />} />

      <Route
        path="/auth/login"
        element={
          <ProtectedRoute authenticationPage>
            <LoginPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <ProtectedRoute authenticationPage>
            <SignupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={"/auth/verify/:email"}
        element={
          <ProtectedRoute authenticationPage>
            <VerifyAccountPage />
          </ProtectedRoute>
        }
      />
      <Route path={"/auth/resend"} element={<Resend />} />

      <Route
        path={"/auth/resetPassword/:email"}
        element={<ResetPasswordPage />}
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <AddFriendPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
