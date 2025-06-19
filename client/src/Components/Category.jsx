import { useEffect, useState } from 'react';
import playIcon from '../assets/playIcon.svg';
import { Link } from 'react-router-dom';
import NoQuizBg from '../assets/NoQuizBg.jpg';
import {CategoryList} from '../Lib/QuizList';


const Category = () => {
  const [quiz, setQuiz] = useState([]);

  useEffect(() => {
    const seen = new Set();
    const uinqueCategories = CategoryList.filter(q => {
        if(seen.has(q.Category)) return false;
        seen.add(q.Category);
        return true;
  });
 setQuiz(uinqueCategories);
  },[]);
  return (
    <div>
      <div className='flex flex-col items-center p-4 space-y-9'>
      <h1 className='text-5xl'>Categories</h1>
      {/* <div className='space-x-10 w-[90%]'>
        <button className='border p-2 cursor-pointer rounded-[30%] w-30 h-10 bg-[#4b0082] text-white text-[19px] '>Football</button>
        <button className='border p-2 cursor-pointer rounded-[30%] w-30 h-10 bg-[#4b0082] text-white text-[19px] '>Movies</button>
        <button className='border p-2 cursor-pointer rounded-[30%] w-30 h-10 bg-[#4b0082] text-white text-[19px] '>Science</button>
        <button className='border p-2 cursor-pointer rounded-[30%] w-30 h-10 bg-[#4b0082] text-white text-[19px] '>Space</button>
        <button className='border p-2 cursor-pointer rounded-[30%] w-30 h-10 bg-[#4b0082] text-white text-[19px] '>Human</button>
        <button className='border p-2 cursor-pointer rounded-[30%] w-30 h-10 bg-[#4b0082] text-white text-[19px] '>Animals</button>
        <button className='border p-2 cursor-pointer rounded-[30%] w-30 h-10 bg-[#4b0082] text-white text-[19px] '>Vechiles</button>
      </div> */}
      <div className='flex w-[90%] justify-start gap-8 text-3xl overflow-y-scroll p-4'>
       {quiz?.map(q => (
         <div className="border min-w-60 max-w-60 min-h-70 max-h-70 flex flex-col gap-2 items-center rounded  p-1 cursor-pointer transition-transform duration-500 ease-in-out hover:scale-[1.09] shadow-lg shadow-black group">
        <img src={q.CategoryImg ? q.CategoryImg : NoQuizBg } alt="img" className='w-60 h-40 object-cover ' />
      <h2>{q.Category} Quiz</h2>
      <Link to={`/quiz/${q.Category}`} className='flex items-center justify-center cursor-pointer gap-3 bg-[#008080] text-white p-1 rounded opacity-0 group-hover:opacity-100 transition duration-500 '>
        <p>Play</p>
        <img src={playIcon} alt="play" className='w-4 ' />
      </Link>
      </div>
       ))}
      </div>
    </div>
    </div>

  )
}

export default Category;