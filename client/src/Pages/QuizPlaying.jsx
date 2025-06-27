import { useNavigate, useParams } from "react-router-dom";
import { CategoryList, QuestionList } from "../Lib/QuizList";
import { useContext, useEffect, useRef, useState } from "react";
import stopWatch from "../assets/stopWatch.svg";
import arrowLeft from "../assets/arrow-left.svg";
import correct from "../assets/correct.png";
import wrong from "../assets/wrong.png";
import { QuizContext } from "../Context/QuizContext.jsx";
import ApiCall from "../ApiCallHooks/ApiCall.js";
import { useMemo } from "react";

const QuizPlaying = () => {
  // const [quiz, setQuiz] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [currentQuesIndex, setCurrentQuesIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const [remainingTime, setRemainingTime] = useState();
  const [timeUp, setTimeUp] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const { quiz } = useContext(QuizContext);
  const nav = useNavigate();

  const { quizDetails } = useParams();
  const quizId = quizDetails.split("-")[0];

  useEffect(() => {
    window.scrollTo({top: 0})
    const fetchQuiz = async () => {
      try {
        const quizResponse = await ApiCall.get("/quiz/quiz/" + quizId);
        setQuizList(quizResponse.data);
        setQuestionList(quizResponse.data.questions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuiz();
  }, []);


const intervalRef = useRef(null); // For storing setInterval ID

  const totalTimeInSec = useMemo(
    () => (quizList?.timeLimit || 0) * 60,
    [quizList]
  );
  useEffect(() => {
  if (!totalTimeInSec || isFinished) return;

  setRemainingTime((prev) =>
    prev === undefined ? totalTimeInSec : prev
  );

  if (isBack) return; 

  intervalRef.current = setInterval(() => {
    setRemainingTime((prev) => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);
        setTimeUp(true);
        setIsFinished(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => {
    clearInterval(intervalRef.current);
  };
}, [totalTimeInSec, isBack, isFinished]);


  const handleClick = (idx) => {
    if (!isAnswered) {
      setSelectedOption(idx);
      setIsAnswered(true);
    }
  };

  const handleNext = () => {
    setCurrentQuesIndex(currentQuesIndex + 1);
    setIsAnswered(false);

    if (selectedOption == questionList[currentQuesIndex]?.correctAnsIndex) {
      setScore(score + 1);
    }

    if (currentQuesIndex + 1 == questionList?.length) {
      setIsFinished(true);
    }
  };
  const handleBack = () => {
    setIsBack(true);
  };
const minute = Math.floor(remainingTime / 60);
const second = remainingTime % 60;

const elapsedTime = totalTimeInSec - remainingTime;
const elapsedMin = Math.floor(elapsedTime / 60);
const elapsedSec = elapsedTime % 60;


  return (
    <div className="min-h-[100vh] w-full flex flex-col items-center pt-10 gap-5 transition-all duration-500 ease-in-out">
      <img
        src={arrowLeft}
        alt="Back"
        onClick={handleBack}
        className="w-10 h-10 rounded-[50%] cursor-pointer hover:bg-gray-300 p-1 absolute left-20"
      />
      {isBack && (
        <>
          <div className="fixed top-0 left-0 h-full w-full bg-black opacity-50" />{" "}
          <div className="text-2xl flex gap-5 flex-col flex-wrap w-[300px] text-center min-h-[10rem] absolute top-65 left-20 p-2 rounded bg-white shadow-lg ">
            <span>Are You Sure? You want to abort this Quiz mission!</span>

            <div className="flex justify-between">
              <button
                className=" bg-red-500 p-0.5 text-white rounded w-[50px] cursor-pointer hover:bg-red-700 hover:scale-110 transition-transform duration-300 ease-in-out"
                onClick={() => setIsBack(false)}
              >
                No
              </button>
              <button
                className=" bg-green-500 p-1 text-white rounded w-[50px] cursor-pointer hover:bg-green-700 hover:scale-110 transition-transform duration-300 ease-in-out"
                onClick={() => window.history.back()}
              >
                Yes
              </button>
            </div>
          </div>
        </>
      )}
      <h1 className="text-3xl flex gap-2 text-[#333333]">
        Quiz Title: <span className="font-bold">{quizList?.title}</span>
      </h1>
      <div className="flex">
        <span className={`text-2xl ${timeUp && "animate-pulse"}`}>
          {quizList?.timeLimit? timeUp
            ? "Time Up!"
            : `Time Left :   ${minute} :   ${
                second < 10 ? "0" + second : second
              } Seconds` : "Time: Unlimited" }
        </span>
      </div>
      <form className=" border p-6 w-150  max-h-120 text-2xl rounded bg-white border-0 shadow-lg ">
        {isFinished ? (
          <div>
            <div className="text-center space-y-5">
              <h2 className="font-bold text-3xl">Congrats! Quiz Completed</h2>
              <p>
                You scored <span className="font-bold">{score}</span> out of{" "}
                <span>{questionList?.length}</span> {quizList?.timeLimit && <span>
                  in{" "}
                {elapsedMin > 0 && elapsedMin + " Minutes"} {elapsedSec} Seconds
                </span>}
              </p>
              <button
                onClick={() => nav(`/quiz/play/${quizId + '-'+quizList?.title}`)}
                className="border rounded bg-[#4b0082] text-white p-1 cursor-pointer hover:bg-purple-800"
              >
                Play Again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <h3>
              Q.no.{currentQuesIndex + 1}:{" "}
              {questionList[currentQuesIndex]?.question}
            </h3>
            <ul className="space-y-5">
              {questionList[currentQuesIndex]?.options?.map((opt, idx) => (
                <li
                  className={`border rounded border-gray-600 p-1 cursor-pointer hover:bg-[#555555] hover:text-white wrong:bg-red-700 correct:bg-green-500 ${
                    isAnswered &&
                    idx == questionList[currentQuesIndex]?.correctAnsIndex
                      ? "bg-green-300"
                      : isAnswered && idx == selectedOption
                      ? "bg-red-400"
                      : ""
                  }  flex items-center justify-between`}
                  onClick={(e) => handleClick(idx)}
                >
                  {opt}
                  <img
                    src={
                      isAnswered &&
                      idx == questionList[currentQuesIndex]?.correctAns
                        ? correct
                        : isAnswered &&
                          questionList[currentQuesIndex]?.option1 ===
                            selectedOption
                        ? wrong
                        : null
                    }
                    alt=""
                    className="w-5"
                  />
                </li>
              ))}
            </ul>
            <div className="text-center">
              {isAnswered && (
                <button
                  className=" border  cursor-pointer p-0.5 rounded outline-0 w-20 text-white bg-[#4b0082] hover:bg-purple-700"
                  type="button"
                  onClick={handleNext}
                >
                  {currentQuesIndex + 1 === questionList.length
                    ? "Finish"
                    : "Next"}
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default QuizPlaying;
