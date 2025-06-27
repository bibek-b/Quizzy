import einstein from '../assets/einstein.png'
import brain from '../assets/brain.png'
import { Link } from "react-router-dom";
const Home = () => {
  return (
  <>
      <div className="w-full flex items-center justify-center h-[82vh]">
      <div className="flex items-center justify-between w-[80%]">
      <img src= {einstein} alt="Like Einstein" className="w-40" />
        <div className="text-center space-y-5">
          <h1 className="text-6xl flex">
          Welcome to,
          <span className="font-bold h-20 bg-gradient-to-r from-violet-600 to-teal-400 bg-clip-text text-transparent">
            Quizzy
          </span>
        </h1>
        <p className="w-100 text-2xl">
          "Think Fast. Score High. And be a Quiz Master."
        </p>
           <div className="space-x-10 flex items-center justify-center">
            <Link to='/quiz/play' className="border flex items-center justify-center w-32 bg-orange-400 hover:bg-orange-600 rounded border-0 outline-0 p-1 text-2xl cursor-pointer text-white hover:bg-[#]">Take a Quiz</Link>
        <Link to='/quiz/create' className="border w-32 flex items-center justify-center bg-[#008080] border-0 rounded outline-0 p-1 text-2xl cursor-pointer text-white hover:bg-[#015757]">Create a Quiz</Link>
           </div>
        </div>
        <img src={brain} alt="Smarty" className="w-40 " />
      </div>
    </div>

    <div className="absolute">

    </div>
    {/* <Category /> */}
  </>
  );
};


export default Home;
