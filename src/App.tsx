import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Verify from "./Components/Verify/Verify";
import Resend from "./Components/Resend/Resend";
import ResetPasswordRequest from "./Components/ResetPasswordRequest/ResetPasswordRequest";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import AddFriendPage from "./pages/AddFriendPage/AddFriendPage";
import HomePage from "./pages/HomePage/HomePage";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import ChatPage from "./pages/ChatPage/ChatPage";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  console.log("Backend URL:", import.meta.env.VITE_APP_BACKEND_URL);

  return (
    <Routes>
      <Route path={"/"} element={<HomePage />} />

      <Route
        path="/auth/login"
        element={
          <ProtectedRoute authenticationPage>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <ProtectedRoute authenticationPage>
            <Signup />
          </ProtectedRoute>
        }
      />
      <Route path={"/auth/verify"} element={<Verify />} />
      <Route path={"/auth/resend"} element={<Resend />} />
      <Route
        path={"/auth/resetPasswordRequest"}
        element={<ResetPasswordRequest />}
      />
      <Route path={"/auth/resetPassword"} element={<ResetPassword />} />

      {/*<Route*/}
      {/*    path="/profile"*/}
      {/*    element={*/}
      {/*        <ProtectedRoute>*/}
      {/*            <ProfilePage />*/}
      {/*        </ProtectedRoute>*/}
      {/*    }*/}
      {/*/>*/}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/all"
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
