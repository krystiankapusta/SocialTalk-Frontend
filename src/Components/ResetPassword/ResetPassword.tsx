import React, { useState } from 'react';
import UserService from '../../Services/UserService';
import { useNavigate } from "react-router-dom";


const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await UserService.resetPassword(newPassword);
            if (response === 'Password has been reset successfully') {
                setMessage('Password has been reset successfully!');
                setTimeout(() => navigate('/auth/login'), 3000);
            }
        } catch (error: any) {
            console.error('Error resetting password:', error.response || error);
            setMessage('Failed to reset password. Please try again.');
        }
    };


    return (
        <div>
            <form onSubmit={handlePasswordReset}>
                <div>
                    <h1>Reset your password</h1>
                    <label htmlFor="newPassword"></label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={"New password"}
                        required
                    />
                </div>

                <div>
                    <button type={'submit'}>Reset password</button>
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
