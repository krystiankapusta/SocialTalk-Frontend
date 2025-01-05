import "./App.css";
import {BrowserRouter, Navigate, Routes, Route} from "react-router-dom";
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Verify from './Components/Verify/Verify';
import Resend from './Components/Resend/Resend';
import ResetPasswordRequest from "./Components/ResetPasswordRequest/ResetPasswordRequest";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
function App() {
    console.log('Backend URL:', import.meta.env.VITE_APP_BACKEND_URL);

  return (
      <BrowserRouter>
        <Routes>
            <Route path={'/'} element={<Navigate to={'/auth/login'} />}/>
            <Route path={'/auth/login'} element={<Login/>}/>
            <Route path={'/auth/signup'} element={<Signup/>}/>
            <Route path={'/auth/verify'} element={<Verify/>}/>
            <Route path={'/auth/resend'} element={<Resend/>}/>
            <Route path={'/auth/resetPasswordRequest'} element={<ResetPasswordRequest/>}/>
            <Route path={'/auth/resetPassword'} element={<ResetPassword/>}/>

        </Routes>
      </BrowserRouter>

      );
}

export default App;
