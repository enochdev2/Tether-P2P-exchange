import React, { useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthProvider';
import {SuccessToast} from "../../utils/Success";

const SignIn = () => {
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    nickname: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     setIsLoading(true); // Show loading state

    // Create the new user data
    const user = {
      ...credentials
    };

    try {
      // Call signUp from AuthContext (which will handle the state and potentially an API call)
      const response = await login(user);

      if(response){

        SuccessToast(" Login successfully");
        navigate('/dashboard/profile'); 
      }else {
        return;
      }

       
      console.log('User signed up:', user);
    } catch (error) {
      console.error('Error during sign-up:', error);
      // Optionally handle error here (e.g., show error message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  bg-gray-100"  style={{ backgroundImage: "url('/bgg.png')" }}>
      <div className="w-full max-w-md p-6 px-7 bg-black/90 rounded-lg shadow-md border-2 border-gray-800 pb-5"   >
        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 ">
            <label htmlFor="nickname" className="block text-base font-semibold text-gray-100">Nickname</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={credentials.nickname}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-md text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-base font-semibold text-gray-100">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-md text-white"
              required
            />
          </div>

          <button type="submit" className="w-full mt-4 bg-green-700 text-xl font-bold py-3 text-white p-2 rounded-md cursor-pointer">
            {isLoading ? <LoadingSpinner /> : "Sign in"}
            </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
