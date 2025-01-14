import Cookies from "js-cookie";
import { authApi } from "../Api/AxiosConfig";

interface UserData {
  username: string;
  email: string;
  password: string;
}
class UserService {
  static async signup(userData: UserData) {
    try {
      const response = await authApi.post(`/auth/signup`, userData);
      return response.data;
    } catch (error) {
      console.error("Signup error: ", error);
      throw error;
    }
  }

  static async login(email: string, password: string) {
    try {
      const response = await authApi.post(`/auth/login`, { email, password });
      console.log("Response from server during login:", response.data);
      return response.data;
    } catch (error) {
      console.error("Login error: ", error);
      throw error;
    }
  }

  static async verifyEmail(email: string, verificationCode: string) {
    try {
      const response = await authApi.post(`/auth/verify`, {
        email,
        verificationCode,
      });
      return response.data;
    } catch (error) {
      console.error("Verification error: ", error);
      throw error;
    }
  }

  static async resendVerificationCode(email: string) {
    try {
      const response = await authApi.post(`/auth/resend?email=${email}`, {});
      return response.data;
    } catch (error) {
      console.error("Verification error: ", error);
      throw error;
    }
  }

  static async resetPasswordRequest(email: String) {
    try {
      const response = await authApi.post(
        `/auth/resetPasswordRequest?email=${email}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error("Reset password request error: ", error);
      throw error;
    }
  }

  static async resetPassword(newPassword: string) {
    const resetToken = Cookies.get("resetToken");
    if (!resetToken) {
      throw new Error("Reset token not found");
    }
    try {
      const response = await authApi.post(
        `/auth/resetPassword`,
        { newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      console.log("Password reset successful:", response);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error resetting password:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }
  // MTExMTExMTEx.MTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEx.MTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEx
}
export default UserService;
