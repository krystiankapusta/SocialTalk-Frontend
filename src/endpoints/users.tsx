import { authApi } from "../Api/AxiosConfig";
import { User } from "../models/users";
import { jwtDecode } from "jwt-decode";

interface UserData {
  username: string;
  email: string;
  password: string;
}

interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  userId: number;
}

export const login = async (email: string, password: string) => {
  try {
    const response = await authApi.post(`/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error: ", error);
    throw error;
  }
};

export const signup = async (userData: UserData) => {
  try {
    const response = await authApi.post(`/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Signup error: ", error);
    throw error;
  }
};

export const verifyEmail = async (email: string, verificationCode: string) => {
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
};

export const resendVerificationCode = async (email: string) => {
  try {
    const response = await authApi.post(`/auth/resend`, { email });
    return response.data;
  } catch (error) {
    console.error("Error resending verification code: ", error);
    throw error;
  }
};

export const resetPasswordRequest = async (email: string) => {
  try {
    const response = await authApi.post(`/auth/resetPasswordRequest`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Reset password request error: ", error);
    throw error;
  }
};

export const resetPassword = async (
  newPassword: string,
  resetToken: string,
) => {
  try {
    const response = await authApi.post(
      `/auth/resetPassword`,
      { newPassword },
      {
        headers: { Authorization: `Bearer ${resetToken}` },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password: ", error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const response = await authApi.get(`/users/me`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data: ", error);
    throw error;
  }
};

export const getUserById = async (id: number) => {
  try {
    const response = await authApi.get(`/users/find/${id}`);
    return response.data as User;
  } catch (error) {
    console.error(`Error fetching user ${id}: `, error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error("Error decoding token: ", error);
    return false;
  }
};

export const getUserId = (): number | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    return decodedToken.userId;
  } catch (error) {
    console.error("Error getting user id: ", error);
    return null;
  }
};
