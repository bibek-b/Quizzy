import { Link } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { useContext } from "react";
import { useFectchUser } from "../ApiCallHooks/UseFetchUser.js";
import profileImg from '../assets/person.jpg';

const Navbar = () => {
   const userData = useFectchUser();
   const { logout, userId } = useContext(UserContext);

  return (
    <nav className="h-18 flex items-center justify-center w-full bg-[#4b0082] text-2xl text-[#ffffff] shadow-lg shadow-indigo-300/50 sticky sticky top-0 z-999">
      <div className="w-full ">
        <ul className="w-full flex items-center justify-around ">
        <Link to='/'>
        <p className="text-4xl p-1 font-bold bg-gradient-to-r from-violet-600 to-teal-400 bg-clip-text text-transparent transition-transform duration-300 ease-in-out hover:scale-[1.1]">Quizzy</p>
        </Link>
          <div className="flex gap-20">
           <Link to='/'>
             <li className=" relative hover:text-[#999999] cursor-pointer  after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:transition-all  after:h-[1px] after:bg-[#999999]">Home</li>
           </Link>
            <Link to='/user/dashboard'>
              <li className=" relative hover:text-[#999999] cursor-pointer  after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:transition-all  after:h-[1px] after:bg-[#999999]">Dashboard</li>
            </Link>
             <Link to='/quiz/play'>
              <li className=" relative hover:text-[#999999] cursor-pointer  after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:transition-all  after:h-[1px] after:bg-[#999999]">Play Quiz</li>
             </Link>
            
            <Link to='/quiz/create'>
              <li className=" relative hover:text-[#999999] cursor-pointer  after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:transition-all  after:h-[1px] after:bg-[#999999]">Create Quiz</li>
            </Link>
          </div>
         {(userData && userId) ? <div className="flex  items-center justify-center gap-7 cursor-pointer">
          <div className="flex flex-col items-center justify-center">
            <img src={profileImg} className="w-10 h-10 rounded-full object-cover" alt="profile" />
          <span className="text-xl">{userData.username}</span>
          </div>
          <div>
            <button onClick={() => logout()} className="bg-red-600 p-0.5 rounded text-xl hover:bg-red-700 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out">Logout</button>
          </div>
         </div> :  <div className="flex gap-10">
           <Link to='/login' className="relative rounded hover:text-[#999999] cursor-pointer px-2 hover:ring-2 transition-all">
  Sign In
</Link>
 {/*login */}
            <Link to='/register' className="relative hover:text-[#999999] cursor-pointer  after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:transition-all  after:h-[1px] after:bg-[#999999]">Sign Up</Link>
          </div>}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
