import React, { useState } from 'react';
import UserService from "../../Services/UserService";
import {Link } from 'react-router-dom';


const VerificationForm = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await UserService.verifyEmail(email, verificationCode);
            console.log('Verification Response:', response);
            if(response === 'Account verified successfully')
            {
                setMessage('E-mail verified successfully!');
            }
        } catch (error) {
            setMessage('Weryfikacja nieudana. Spróbuj ponownie.');
        }
    };

    return (
        <div>
            <form onSubmit={handleVerification}>
                <h1>Verify Your Account</h1>
                <p>Please enter the code sent to your email</p>
                <div>
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
                    <label htmlFor="code">Kod Weryfikacyjny</label>
                    <input
                        type="text"
                        id="code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <input
                        type={'submit'}
                        value={'Verify email'}
                    />

                    <Link
                        to={'/auth/resend?email=${email}'}
                    >
                        Resend code again
                    </Link>
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default VerificationForm;
