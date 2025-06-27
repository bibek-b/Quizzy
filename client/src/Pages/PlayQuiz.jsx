import { useContext, useEffect, useRef, useState } from "react";
import playIcon from "../assets/playIcon.svg";
import cross from "../assets/cross.svg";
import { Link, useNavigate } from "react-router-dom";
import NoQuizBg from "../assets/NoQuizBg.jpg";
import { CategoryList, QuestionList } from "../Lib/QuizList.js";
import { OrbitProgress } from "react-loading-indicators";
import ApiCall from '../ApiCallHooks/ApiCall.js';
import {QuizContext} from '../Context/QuizContext.jsx';

const PlayQuiz = () => {
  const [quizList, setQuizList] = useState([]);
  const [questionInfo, setQuestionInfo] = useState(null);
  const [isPlayed, setIsPlayed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef();
  const nav = useNavigate("");

  const { currentQuizIndex, setCurrentQuizIndex} = useContext(QuizContext);

  useEffect(() => {
    const seen = new Set();
    const uinqueCategories = CategoryList.filter((q) => {
      if (seen.has(q.Category)) return false;
      seen.add(q.Category);
      return true;
    });
    // const isQuesAdded = QuestionList.filter(q => seen.has(q.CategoryName));
    const isQuesAdded = uinqueCategories.filter((u) =>
      QuestionList.some((q) => q.CategoryName === u.Category)
    );
    // setQuiz(isQuesAdded);

    const fetchAllQuiz = async () => {
      try {
        const quizResponse = await ApiCall.get('/quiz');
        setQuizList(quizResponse.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllQuiz();
  }, []);
  const handlePlay = (title, quizId,idx) => {
    setCurrentQuizIndex(idx);
    setIsPlayed(true);
    const quiz = quizList.filter(q => q._id === quizId);
    console.log(quizList[idx])
    const questions = quiz.map(q => q.questions);
    setQuestionInfo([...questions]);
    isPlayed && nav(`/quiz/play/${category}`);
  };
  const handleStart = (quizId,title) => {
    const noSpaces = title.replace(/\s+/g, '');
    setIsLoading(true);
    isLoadingRef.current = true;
    setTimeout(() => {
      if (isLoadingRef.current) nav(`/quiz/play/${quizId + '-' + noSpaces}`);
    }, 3000);
  };

  const handleCancel = () => {
    setIsLoading(false);
    isLoadingRef.current = false;
  };

    const currentQuiz = quizList[currentQuizIndex] || [];

  return (
    <div className={`h-[81vh] `}>
      <div className={`flex flex-col items-center p-4 space-y-9 mt-10`}>
        <h1 className="text-5xl">Play Any Quiz</h1>

        {isPlayed && (
          <>
            <div
              className={`fixed top-0 left-0 w-full h-full bg-black opacity-50 z-[40]`}
            />
              <div
                className={`fixed  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-[28rem]  max-h-[35rem] bg-white shadow-lg  rounded z-[50]`}
              >
                {questionInfo?.map((q) => (
                  <div className="p-8 text-2xl space-y-10" key={q.category}>
                    {isLoading ? (
                      <div className="flex  flex-col items-center justify-between">
                        <p className="text-4xl flex items-center">
                          Starting Quiz...{" "}
                          <OrbitProgress
                            color="#32cd32"
                            size="small"
                            text=""
                            textColor="black"
                          />
                        </p>{" "}
                        <button
                          className=" p-1 w-30 bg-red-500 rounded mt-20 cursor-pointer text-white hover:bg-red-600 hover:scale-110 transition-transform duration-500 ease-in-out"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between ">
                          <h1 className="font-bold">
                            Quiz Title: {currentQuiz?.title}
                          </h1>
                        
                          <img
                            src={cross}
                            alt="cancel"
                            onClick={() => setIsPlayed(false)}
                            className="w-8 h-8 rounded-[50%] cursor-pointer hover:bg-gray-200 p-1 hover:scale-115 transition-transform duration-100 ease-in "
                          />
                        </div>
                        <div>
                          <span className="text-xl">{currentQuiz?.desc}</span>
                        </div>
                        <div className="space-y-2">
                          <p>Total Question: {currentQuiz?.questions.length}</p>
                          <p>Type: {currentQuiz?.quizType}</p>
                          <p>Time Limit: {currentQuiz?.timeLimit ? currentQuiz?.timeLimit + 'minutes' : 'Unlimited'   } </p>
                        </div>
                        <div className="text-center">
                          <button
                            className="bg-green-400 text-white p-1 rounded w-18 cursor-pointer hover:bg-green-700 hover:scale-115 transition-transform duration-500 ease-in-out"
                            onClick={() => handleStart(currentQuiz?._id,currentQuiz?.title)}
                          >
                            Start
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
          </>
        )}
        <div className="flex w-[90%] justify-start gap-8 text-3xl overflow-y-scroll p-4">
          {quizList ?.map((q, idx) => (
            <div className="border min-w-60 max-w-60 min-h-70 max-h-70 flex flex-col gap-2 items-center rounded  p-1 cursor-pointer transition-transform duration-500 ease-in-out hover:scale-[1.09] shadow-lg shadow-black group">
              <img
                src={q.CategoryImg ? q.CategoryImg : NoQuizBg}
                alt="img"
                className="w-60 h-40 object-cover "
              />
              <h2>{q?.title}</h2>
              <button
                onClick={() => handlePlay(q?.title, q?._id, idx)}
                className="flex items-center justify-center cursor-pointer gap-3 bg-green-400 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition duration-500 "
              >
                <p>Play</p>
                <img src={playIcon} alt="play" className="w-4 " />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayQuiz;
