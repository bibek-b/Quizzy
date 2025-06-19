import { useNavigate, useParams } from "react-router-dom";
import { CategoryList, QuestionList } from "../Lib/QuizList";
import { useContext, useEffect, useRef, useState } from "react";
import stopWatch from "../assets/stopWatch.svg";
import arrowLeft from "../assets/arrow-left.svg";
import correct from "../assets/correct.png";
import wrong from "../assets/wrong.png";
import { QuizContext } from "../Context/QuizContext.jsx";


const QuizPlaying = () => {
  const [quiz, setQuiz] = useState([]);
  const [currentQuesIndex, setCurrentQuesIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const [remainingTime, setRemainingTime] = useState();
  const [timeUp, setTimeUp] = useState(false);
const { quizDetails, questions} = useContext(QuizContext);
console.log(questions)
  const nav = useNavigate();

  const { category } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    // setQuiz(quizDetails.filter((q) => q.CategoryName == category));
  }, [category]);

  const currentTimeRef = useRef(0);
  // const timerRef = useRef(null);
    const totalTimeInSec = quiz[0]?.timeLimit * 60 || 0;

  useEffect(() => {
    if (isBack || isFinished) return;


    if (currentTimeRef.current === 0) {
      currentTimeRef.current = totalTimeInSec;
    }
    setRemainingTime(currentTimeRef.current);

    const timerRef = setInterval(() => {
      currentTimeRef.current -= 1;
      setRemainingTime(currentTimeRef.current);

      if (currentTimeRef.current <= 0) {
        clearInterval(timerRef);
        setTimeUp(true);
        setIsFinished(true);
      }
    }, 1000);


    return () => clearInterval(timerRef);
  }, [quiz, isBack, isFinished]);

  console.log(questions)
  const ques = questions.flatMap((q) => q.Questions);

  const handleClick = (option) => {
    if (!isAnswered) {
      setSelectedOption(option);
      setIsAnswered(true);
    }
  };

  const handleNext = () => {
    setCurrentQuesIndex(currentQuesIndex + 1);
    setIsAnswered(false);

    if (selectedOption == ques[currentQuesIndex]?.correctAns) {
      setScore(score + 1);
    }

    if (currentQuesIndex + 1 == ques?.length) {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    setIsBack(true);
    // nav("/play");
  };

  const minute = Math.floor(remainingTime / 60);
  const second = remainingTime % 60;

  const elapsedTime = totalTimeInSec - currentTimeRef.current;
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
                onClick={() => nav("/quiz/play")}
              >
                Yes
              </button>
            </div>
          </div>
        </>
      )}
      <h1 className="text-3xl flex gap-2 text-[#333333]">
        Quiz Category: <span className="font-bold">{category}</span>
      </h1>
      <div className="flex">
        <span className={`text-2xl ${timeUp && "animate-pulse"}`}>
          {timeUp
            ? "Time Up!"
            : `Time Left :   ${minute} :   ${
                second < 10 ? "0" + second : second
              } Seconds`}
        </span>
      </div>
      <form className=" border p-6 w-150  max-h-120 text-2xl rounded bg-white border-0 shadow-lg ">
        {isFinished ? (
          <div>
            <div className="text-center space-y-5">
              <h2 className="font-bold text-3xl">Congrats! Quiz Completed</h2>
              <p>
                You scored <span className="font-bold">{score}</span> out of {" "}
                <span>{ques.length}</span> in {elapsedMin > 0 && elapsedMin + " Minutes"}  { elapsedSec} Seconds
              </p>
              <button
                onClick={() => nav(`/quiz/play/${category}`)}
                className="border rounded bg-[#4b0082] text-white p-1 cursor-pointer hover:bg-purple-800"
              >
                Play Again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <h3>
              Q.no.{currentQuesIndex + 1}: {ques[currentQuesIndex]?.question}
            </h3>
            <ul className="space-y-5">
              <li
                className={`border rounded border-gray-600 p-1 cursor-pointer hover:bg-[#555555] hover:text-white wrong:bg-red-700 correct:bg-green-500 ${
                  isAnswered &&
                  ques[currentQuesIndex]?.option[0] ==
                    ques[currentQuesIndex]?.correctAns
                    ? "bg-green-300"
                    : isAnswered &&
                      ques[currentQuesIndex]?.option1 == selectedOption
                    ? "bg-red-400"
                    : ""
                }  flex items-center justify-between`}
                onClick={(e) => handleClick(ques[currentQuesIndex]?.option1)}
              >
                {ques[currentQuesIndex]?.option1}
                <img
                  src={
                    isAnswered &&
                    ques[currentQuesIndex]?.option1 ==
                      ques[currentQuesIndex]?.correctAns
                      ? correct
                      : isAnswered &&
                        ques[currentQuesIndex]?.option1 === selectedOption
                      ? wrong
                      : null
                  }
                  alt=""
                  className="w-5"
                />
              </li>
              <li
                className={`border rounded border-gray-600 p-1 cursor-pointer hover:bg-[#555555] hover:text-white ${
                  isAnswered &&
                  ques[currentQuesIndex]?.option2 ==
                    ques[currentQuesIndex]?.correctAns
                    ? "bg-green-400"
                    : isAnswered &&
                      ques[currentQuesIndex]?.option2 == selectedOption
                    ? "bg-red-400"
                    : ""
                } flex items-center justify-between `}
                onClick={(e) => handleClick(ques[currentQuesIndex]?.option2)}
              >
                {ques[currentQuesIndex]?.option2}{" "}
                <img
                  src={
                    isAnswered &&
                    ques[currentQuesIndex]?.option2 ==
                      ques[currentQuesIndex]?.correctAns
                      ? correct
                      : isAnswered &&
                        ques[currentQuesIndex]?.option2 === selectedOption
                      ? wrong
                      : null
                  }
                  alt=""
                  className="w-5"
                />
              </li>
              <li
                className={`border rounded border-gray-600 p-1 cursor-pointer hover:bg-[#555555] hover:text-white ${
                  isAnswered &&
                  ques[currentQuesIndex]?.option3 ==
                    ques[currentQuesIndex]?.correctAns
                    ? "bg-green-400"
                    : isAnswered &&
                      ques[currentQuesIndex]?.option3 == selectedOption
                    ? "bg-red-400"
                    : ""
                } flex items-center justify-between`}
                onClick={(e) => handleClick(ques[currentQuesIndex]?.option3)}
              >
                {ques[currentQuesIndex]?.option3}
                <img
                  src={
                    isAnswered &&
                    ques[currentQuesIndex]?.option3 ==
                      ques[currentQuesIndex]?.correctAns
                      ? correct
                      : isAnswered &&
                        ques[currentQuesIndex]?.option3 === selectedOption
                      ? wrong
                      : null
                  }
                  alt=""
                  className="w-5"
                />
              </li>
              <li
                className={`border rounded border-gray-600 p-1 cursor-pointer hover:bg-[#555555] hover:text-white ${
                  isAnswered &&
                  ques[currentQuesIndex]?.option4 ==
                    ques[currentQuesIndex]?.correctAns
                    ? "bg-green-400"
                    : isAnswered &&
                      ques[currentQuesIndex]?.option4 == selectedOption
                    ? "bg-red-400"
                    : ""
                } flex items-center justify-between`}
                onClick={(e) => handleClick(ques[currentQuesIndex]?.option4)}
              >
                {ques[currentQuesIndex]?.option4}
                <img
                  src={
                    isAnswered &&
                    ques[currentQuesIndex]?.option4 ==
                      ques[currentQuesIndex]?.correctAns
                      ? correct
                      : isAnswered &&
                        ques[currentQuesIndex]?.option4 === selectedOption
                      ? wrong
                      : null
                  }
                  alt=""
                  className="w-5"
                />
              </li>
            </ul>
            <div className="text-center">
              {isAnswered && (
                <button
                  className=" border  cursor-pointer p-0.5 rounded outline-0 w-20 text-white bg-[#4b0082] hover:bg-purple-700"
                  type="button"
                  onClick={handleNext}
                >
                  {currentQuesIndex + 1 === ques.length ? "Finish" : "Next"}
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
