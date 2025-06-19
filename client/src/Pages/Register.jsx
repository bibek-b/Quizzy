import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import ApiCall from "../ApiCallHooks/ApiCall.js";

const Register = () => {
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handleRegister = async (e) => {
    
    e.preventDefault();

    const formData = new FormData(e.target);
    const { username, email, password, confirmPassword } = Object.fromEntries(formData);

    if(password !== confirmPassword){
        setError('Passwords do not match!');

      setTimeout(() => {
        setError('');
      }, 3000);
    }

    try {
      await ApiCall.post('/auth/register', {
        username,
        email,
        password
      });

      nav('/login')
    } catch (error) {
      console.log(error)
      setError(error.response.data.message);
    }
  }

  return (
    <div className='flex items-center justify-center w-[100vw] h-[100vh] flex-col gap-4 shadow-lg bg-purple-200' >
      <form className='flex flex-col gap-3 bg-white p-5 w-[25vw] rounded shadow-lg text-xl' onSubmit={handleRegister}>
     <caption className='font-bold text-4xl'>Sign Up</caption>

        <label htmlFor="username">Username: </label>
        <input minLength={3} name="username" required type="text" placeholder="Bibek" className='border border-gray-400 outline-0 rounded p-2 '/>

        <label htmlFor="email">Email:</label>
        <input type="email" required name='email' placeholder="abc@gmail.com" className='border border-gray-400 outline-0 rounded p-2 '/>

        <label htmlFor="password">Password</label>
        <input type="password" name="password" minLength={8} required placeholder="testings" className='border border-gray-400 outline-0 rounded p-2'/>

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="confirmPassword" name="confirmPassword" minLength={8} required placeholder="testings" className='border border-gray-400 outline-0 rounded p-2 '/>
   {error.length > 0 &&   <p className="text-red-600">{error}</p>}
        <div className='flex flex-col items-center justify-center gap-3 mt-2'>
          <button className='bg-blue-500 text-xl text-white p-1 rounded cursor-pointer hover:bg-blue-600 transition-all duration-300 hover:scale-105' type="submit">Register</button>
          <span className="text-xl">Already have an account? <Link to='/login' className="text-blue-500">Login</Link></span>
        </div>
      </form>
    </div>
  )
}

export default Register