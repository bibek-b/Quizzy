import { useLocation, useNavigate } from "react-router-dom";
import eye from "../assets/eye.svg";
import Tick from "../assets/correct.png";
import Edit from "../assets/edit.svg";
import backWhite from "../assets/arrow-left-white.svg";
import { Link } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { useContext, useEffect, useState } from "react";
import { QuizContext } from "../Context/QuizContext";
import ApiCall from "../ApiCallHooks/ApiCall";
import { UserContext } from "../Context/UserContext";

const PreviewQuiz = () => {
  const [isPublishing, setIsPublishing] = useState(false);

  const { quizDetails, questions, setIsQuizEdit, IsQuizEdit , sendQuizDetails, sendQuestions} =
    useContext(QuizContext);
    const { userId}  = useContext(UserContext);
  const nav = useNavigate();


  useEffect(() => {
    setTimeout(() => {
       isPublishing &&  nav('/user/dashboard');
    }, 3000);
  }, [isPublishing]);

  const handleQuizEdit = () => {
    setIsQuizEdit(true);
    nav("/quiz/edit/quizDetail");

  };
  const handleQuizPublish = async () => {

     try {
     
      const res = await ApiCall.post('/quiz/add', {quizDetail: quizDetails, questionDetails: questions, userId});
      sendQuizDetails(res.data.quiz);
      if(res.status == 200){
     setIsPublishing(true);

      }
     } catch (error) {
      console.log(error)
     }
  }

  return (
    <div className="h-[100%] flex flex-col items-center gap-10">
      {isPublishing && (
        <>
          <div className=" top-0 left-0 bg-black opacity-50 w-full h-full fixed z-[40]" />
          <div className="text-center text-3xl absolute z-[41] h-[250px] bg-white top-1/3 p-10 space-y-5 rounded shadow-lg">
            <OrbitProgress
              color="#32cd32"
              size="small"
              text=""
              textColor="black"
            />
            <h4>Publishing Your Quiz</h4>
            <button
              className="text-white rounded p-0.5 cursor-pointer hover:bg-red-700 hover:scale-105 transition-all duration-500 ease-in-out bg-red-500 shadow-lg"
              onClick={() => setIsPublishing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      <div className="pl-27 pt-5 text- w-[100vw] ">
        <div className="flex  text-5xl gap-2 ">
          <img src={eye} alt="Preview" className="w-8" />
          Preview Your Quiz
        </div>
        <div className="space-x-5 text-2xl flex items-center absolute right-20 top-25">
          <Link
            to="/"
            className="bg-red-500 p-1 rounded cursor-pointer hover:bg-red-600 hover:scale-105 transition-all duration-500 ease-in-out text-white "
          >
            Return
          </Link>
          <button
            className="bg-green-500 p-1 rounded cursor-pointer hover:bg-green-600 hover:scale-105 transition-all duration-500 ease-in-out text-white "
            onClick={handleQuizPublish}
          >
            Publish
          </button>
        </div>
      </div>
      <div className=" bg-blue-100  w-[60%] rounded flex  flex-col items-center gap-10 pt-5 pb-5 mb-8 relative">
        <button
          className="absolute right-5 bg-white p-1 rounded w-[110px] flex items-center justify-center text-xl gap-1 hover:bg-gray-100 hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer"
          onClick={handleQuizEdit}
        >
          <img src={Edit} alt="Edit quiz" className="w-5" />
          Edit Quiz
        </button>
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold ">
            Quiz Title: {quizDetails?.title}{" "}
          </h1>
          <p className="text-center max-w-[400px] break-words ">
            {quizDetails?.desc}
          </p>
        </div>
        <div className="w-[80%] space-y-5">
          <div className="text-2xl bg-red-200 p-2 text-xl rounded flex justify-between relative w-[40%] ">
            <div>
              <h4>Type: {quizDetails?.quizType}</h4>
              <h4>No. of Questions: {quizDetails?.noOfQues}</h4>
              <h4>
                Time Limit:{" "}
                {quizDetails?.timeLimit === 0
                  ? "Unlimited"
                  : quizDetails?.timeLimit + " Minute(s)"}
              </h4>
            </div>
          </div>
          <h2 className="text-2xl font-bold">Questions</h2>
          {questions?.map((q, index) => (
            <div
              key={index}
              className=" text-2xl bg-white p-5  w-[650px] rounded space-y-3 relative"
            >
              <h3>{"Q.no. " + (index + 1) + ".  " + q?.question}</h3>
              <div className="flex flex-col gap-2">
                {q?.options?.map((o, idx) => (
                  <div key={idx}
                    className={`flex items-center justify-between gap-3 ${
                      idx === q?.correctAnsIndex && "bg-green-200"
                    } p-1 rounded bg-gray-200`}
                  >
                    <span>{o}</span>
                    {idx === q?.correctAnsIndex && (
                      <div className="flex items-center justify-center gap-3 text-green-600 text-xl">
                        Correct Answer
                        <img
                          src={Tick}
                          alt="Correct Answer"
                          className="w-4 h-4 cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviewQuiz;
