import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const { login,user,handleGoogleSync } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [errors, setErrors] = useState({});
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);

    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.toLowerCase());

    useEffect(() => {
        if(user){
            navigate('/dashboard');
        }
    },[user]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);

        const errors = {};
        
        if (!loginEmail.trim()){
            errors.email = "Email is required";
        }else if(!validateEmail(loginEmail)){
            errors.email = "Invalid Email Format";
        }
        if (!loginPassword.trim()) {
            errors.password = "Password is required";
        }else if(loginPassword.length < 8){
            errors.password = "Password should have at least 8 characters";
        }
        setErrors(errors);

        if(Object.keys(errors).length === 0){
            try{

                const response = await axios.post('http://localhost:5001/login',
                    {
                        email:loginEmail,
                        password:loginPassword
                    },
                    {
                        headers:{
                            'Content-Type':'application/json',
                        },
                    }
                );
                if(response.data.status){
                    login(response.data.token);
                    handleGoogleSync(response.data.googleSync);
                    navigate('/dashboard');
                }
            }catch(err){
                console.error(err);
            }
        }
        setLoginLoading(false);
    };

    const handleRegister = async(e) =>{
        e.preventDefault();
        setRegisterLoading(true);
        const errors = {};
        
        if (!registerEmail.trim()){
            errors.registerEmail = "Email is required";
        }else if(!validateEmail(registerEmail)){
            errors.registerEmail = "Invalid Email Format";
        }
        if (!registerPassword.trim()) {
            errors.registerPassword = "Password is required";
        }else if(registerPassword.length < 8){
            errors.registerPassword = "Password should have at least 8 characters";
        }
        if(registerPassword != registerConfirmPassword){
            errors.registerConfirmPassword = "Password doesn't match";
        }
        if (!registerUsername.trim()){
            errors.registerUsername = "Username is required";
        }

        setErrors(errors);

        if(Object.keys(errors).length === 0){
            const response = await axios.post('http://localhost:5001/register-user',
                {
                    username:registerUsername,
                    email:registerEmail,
                    password:registerPassword,
                },{
                    headers:{
                        "Content-Type":'application/json'
                    }
                }
            );
            if(response.data){
                toast.success(response.data.message);
                setIsRegister(false);
            }
        }
        setRegisterLoading(false);
        console.log('asdfgh')

    }

    return (
        <div className="login-page">
            <div className="form">
                {isRegister ? (
                    <form className="register-form" onSubmit={handleRegister}>
                        <div className='login-header'>Register</div>
                        <input type="text" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} placeholder="Username" />
                        {errors.registerUsername && <span className='errors'>{errors.registerUsername}</span>}
                        <input type="text" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} placeholder="Email Address" />
                        {errors.registerEmail && <span className='errors'>{errors.registerEmail}</span>}
                        <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Password" />
                        {errors.registerPassword && <span className='errors'>{errors.registerPassword}</span>}
                        <input type="password" value={registerConfirmPassword} onChange={(e) => setRegisterConfirmPassword(e.target.value)} placeholder="Confirm Password" />
                        {errors.registerConfirmPassword && <span className='errors'>{errors.registerConfirmPassword}</span>}
                        <button>{registerLoading ? 'Registering...' : 'Register'}</button>
                        <p className="message">Already registered? <span onClick={() => setIsRegister(false)}>Sign In</span></p>
                    </form>
                ) : (
                    <form className="login-form" onSubmit={handleLogin}>
                        <div className='login-header'>Login</div>
                        <input type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" />
                        {errors.email && <span className='errors'>{errors.email}</span>}
                        <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" />
                        {errors.password && <span className='errors'>{errors.password}</span>}
                        <button type="submit">{loginLoading ? 'Logging in...' : 'Login'}</button>
                        <p className="message">Not registered? <span onClick={() => setIsRegister(true)}>Create an account</span></p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
