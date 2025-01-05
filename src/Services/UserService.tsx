import axios from "axios";

interface UserData {
    username: string;
    email: string;
    password: string;

}
class UserService
{
    static BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

    static async signup(userData: UserData)
    {
        try {
            const response = await axios.post(
                `${UserService.BASE_URL}/auth/signup`,
                userData,
                )
            return response.data;
        } catch(error)
        {
            console.error('Signup error: ', error);
            throw error;
        }

    }

    static async login(email: string, password: string)
    {
        try {
            const response = await axios.post(
                `${UserService.BASE_URL}/auth/login`,
                {email, password}
            )
            return response.data;
        } catch(error)
        {
            console.error('Login error: ', error);
            throw error;
        }

    }

    static async verifyEmail(email: string, verificationCode: string) {
        try {
            const response = await axios.post(
                `${UserService.BASE_URL}/auth/verify`,
                { email, verificationCode }
            );
            return response.data;
        } catch (error) {
            console.error('Verification error: ', error);
            throw error;
        }
    }

    static async resendVerificationCode(email: string) {
        try {
            const response = await axios.post(
                `${UserService.BASE_URL}/auth/resend?email=${email}`,
                {}
            );
            return response.data;
        } catch (error) {
            console.error('Verification error: ', error);
            throw error;
        }
    }

    static async resetPasswordRequest(email: String) {
        try {
            const response = await axios.post(
                `${UserService.BASE_URL}/auth/resetPasswordRequest?email=${email}`,
                {}
            );
            return response.data;
        } catch (error) {
            console.error('Reset password request error: ', error);
            throw error;
        }
    }

    static async resetPassword(newPassword: string) {
        try {
            const response = await axios.post(
                `${UserService.BASE_URL}/auth/resetPassword`,
                { newPassword },
                { withCredentials: true }
            );
            console.log('Password reset successful:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error resetting password:', error.response?.data || error.message);
            throw error;
        }
    }




}
export default UserService;
