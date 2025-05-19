import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../utils/AuthProvider';
import {SuccessToast} from "../../utils/Success";

const SignUp = () => {
  const { signUp } = useAuth(); 
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    password: '',  
    fullName: '',
    dob: '',
    phone: '',
    bankName: '',
    bankAccount: '',
    tetherAddress: '',
    referralCode: ''
  });


  const handleChange =  (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Show loading state

    // Create the new user data
    const newUser = {
      ...formData,
      bankAccount: Number(formData.bankAccount), 
      status: 'inactive', // Set initial status as inactive
      admin: true, // Defaulting admin to false
    };

    try {
      // Call signUp from AuthContext (which will handle the state and potentially an API call)
      const response = await signUp(newUser);

      if(response){
        SuccessToast(" you have successfully registered")
        navigate('/signin'); 
      }else {
        return;
      }      
       
      console.log('User signed up:', newUser);
    } catch (error) {
      console.error('Error during sign-up:', error);
      // Optionally handle error here (e.g., show error message)
    } finally {
      setIsLoading(false); // Hide loading state after completion
    }
  };

  return (
    <div className="flex justify-center pt-20 md:pt-28 md:b-10 items-center min-h-screen " style={{ backgroundImage: "url('/bgg.png')" }}>
      <div className="w-full max-w-5xl p-6 px-10 bg-black/90 rounded-lg shadow-xl border border-gray-700 md:mb-10">
        <h2 className="text-2xl font-bold text-center mb-4 text-white">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-100">Username <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full mt-1 py-3 p-2 border-gray-500 border bg-gray-950/90 text-white rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="nickname" className="block text-sm font-semibold text-gray-100">Nickname (Platform Name) <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full mt-1 p-2  rounded-md border-gray-500 py-3 border bg-gray-950/90 text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-100">Password <span className="text-red-500">*</span></label>
              <input
                type="password" // Use password type for security
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 p-2 border-gray-500 border py-3 bg-gray-950/90 text-white rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-100">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full mt-1 p-2 py-3 border-gray-500 border bg-gray-950/90 text-white rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="dob" className="block text-sm font-semibold text-gray-100">Date of Birth (8-digit format) <span className="text-red-500">*</span></label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full mt-1 p-2 py-3 border-gray-500 border bg-gray-950/90 text-white rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-100">Phone Number <span className="text-red-500">*</span></label>
              <input
                type="number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mt-1 p-2 py-3 border-gray-500 border bg-gray-950/90 text-white rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="bankName" className="block text-sm font-semibold text-gray-100">Bank Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full mt-1 p-2 py-3 border-gray-500 border bg-gray-950/90 text-white rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="bankAccount" className="block text-sm font-semibold text-gray-100">Bank Account Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="bankAccount"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                className="w-full mt-1 p-2 py-3 border-gray-500 border bg-gray-950/90 text-white rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="tetherAddress" className="block text-sm font-semibold text-gray-100">Tether Address (Solana address) <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="tetherAddress"
                name="tetherAddress"
                value={formData.tetherAddress}
                onChange={handleChange}
                className="w-full mt-1 p-2 py-3 border-gray-500 border bg-gray-950/90 text-white rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="referralCode" className="block text-sm font-semibold text-gray-100">Referral Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="referralCode"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full mt-1 p-2 py-3 border-gray-500 border bg-gray-950/90 text-white rounded-md"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full mt-4 bg-green-700 text-white p-3 cursor-pointer rounded-md hover:bg-green-800">
            {isLoading ? <LoadingSpinner /> : "Sign Up"}
            </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
