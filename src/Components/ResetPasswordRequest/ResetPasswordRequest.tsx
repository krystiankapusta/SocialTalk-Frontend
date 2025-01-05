import React, { useState } from 'react';
import UserService from '../../Services/UserService';

const ResetPasswordRequest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleRequestResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await UserService.resetPasswordRequest(email);
            if (response === 'Reset password link sent to your email')
            {
                setMessage('Password reset link sent! Please check your email.');
            }

        } catch (error) {
            setMessage('Failed to send reset link. Please try again.');

        }
    };

    return (
        <div>
            <form onSubmit={handleRequestResetPassword}>
                <div>
                    <h1>Enter your email to get reset link</h1>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button type={'submit'}>Send reset link</button>
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    );


};
export default ResetPasswordRequest;