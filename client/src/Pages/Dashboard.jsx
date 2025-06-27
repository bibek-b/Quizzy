import { useContext, useEffect, useState } from "react";
import quizImg from "../assets/NoQuizBg.jpg";
import MyStats from "../Components/MyStats";
import { Link, useNavigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { QuizContext } from "../Context/QuizContext";
import { useFectchUser } from "../ApiCallHooks/UseFetchUser";
import ApiCall from "../ApiCallHooks/ApiCall";
import { UserContext } from "../Context/UserContext";

const Dashboard = () => {
  const [hasQuiz, setHasQuiz] = useState([]);
  const [isStartQuiz, setIsStartQuiz] = useState(false);
  const [isEditDashboard, setIsEditDashboard] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [userQuiz, setUserQuiz] = useState(null);
  const [singleQuiz, setSingleQuiz] = useState(null);

  const nav = useNavigate();

  const userData = useFectchUser();
  const { userId } = useContext(UserContext);

  const { quizDetails, setIsQuizEdit,currentQuizIndex, setQuiz } =
    useContext(QuizContext);
  useEffect(() => {
    if (!userId) return;
    window.scrollTo({ top: 0 });

    const getQuiz = async () => {
      try {
        const res = await ApiCall.get("/quiz/" + userId);
        setUserQuiz(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getQuiz();
  }, [userId]);

  
  useEffect(() => {
    isEditDashboard && nav("/quiz/edit/quizDetail");
  }, [isEditDashboard]);

  const handleEdit = (quizId) => {
    setIsQuizEdit(true);
    setIsEditDashboard(true);

    const editQuiz = userQuiz?.filter(q => q._id === quizId);
    setQuiz(editQuiz)
  };

  const handleQuizStart = (quizId) => {
    setIsStartQuiz(true);
    const isPlayQuiz = userQuiz?.find((q) => q._id === quizId);
    setSingleQuiz(isPlayQuiz);
    
  };

  const handleHasStarted = () => {
    setHasStarted(true);
    setTimeout(() => {
      nav("/quiz/play/" + singleQuiz?._id + '-'+singleQuiz?.title);
    }, 3000);
  }
  const handleDelete = async (id) => {
    const userChoice = confirm("Are you sure? You want to delete this quiz!");
    if (!userChoice) return;

    try {
      if (userChoice) {
        await ApiCall.delete("/quiz/delete/" + id);
        alert("Quiz deleted successfully");
        setUserQuiz((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-[100vh] p-10 space-y-20 ">
  {!userId ? <h4 className="text-2xl text-center mt-20"><Link to='/login' className="text-blue-400 underline">Log In</Link>, To See Your Dashboard!</h4> : <>
          <h1 className="text-5xl font-bold">Welcome, {userData?.username}</h1>
      <div className="space-y-5 ">
        <h1 className="text-center text-4xl font-bold">Your Quiz List</h1>
        {isStartQuiz && (
          <>
            <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10 " />
            <div className="absolute space-y-10 min-w-[400px] min-h-[300px] max-h-[500px] max-w-[400px] left-[40%] top-1/5 bg-white z-12 p-10 text-xl rounded shadow-lg">
              {!hasStarted ? (
                <>
                  <div className="text-center space-y-5 ">
                    <h3 className="text-3xl font-bold">
                      Quiz Title: {singleQuiz?.title}{" "}
                    </h3>
                    <p className="text-[16px] break-words text-center ">
                      {singleQuiz?.desc}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p>Total Question(s): {singleQuiz?.noOfQues}</p>
                    <p>Quiz Type: {singleQuiz?.quizType}</p>
                    <p>
                      Time Limit:{" "}
                      {singleQuiz?.timeLimit > 0 ? singleQuiz?.timeLimit +' minute(s)' : "Unlimited"}{" "}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      className="  bg-blue-500 text-white w-[80px] p-1 rounded cursor-pointer hover:scale-105 transition-transform duration-500 ease-in-out hover:bg-blue-600 "
                      onClick={() => setIsStartQuiz(false)}
                    >
                      Back
                    </button>
                    <button
                      className="bg-green-500 text-white p-1 rounded cursor-pointer hover:scale-105 transition-transform duration-500 ease-in-out hover:bg-green-600"
                      onClick={handleHasStarted}
                    >
                      Start Now
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-10 text-4xl">
                  <OrbitProgress
                    color="#32cd32"
                    size="small"
                    text=""
                    textColor="black"
                  />
                  <h4>Starting Quiz</h4>
                  <button
                    className="bg-red-500 hover:scale-105 transition-transform duration-500 ease-in-out hover:bg-red-700 text-white p-0.5 cursor-pointer rounded w-24"
                    onClick={() => setHasStarted(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        <div className="grid grid-cols-4 space-y-8  bg-violet-100 w-full  p-4 rounded  min-h-[400px]">
          {userQuiz?.length > 0 ? (
            userQuiz.map((q, index) => (
              <div
                key={q?._id}
                className=" w-70 border min-h-[250px] h-fit shadow-lg flex gap-2 flex-col justify-center p-2 items-center rounded hover:scale-105 cursor-pointer transition-all duration-300 "
              >
                <img
                  src={quizImg}
                  alt="QuizImg"
                  className="w-70 h-35 object-cover"
                />
                <div className="text-center space-y-2">
                  <h1 className="font-bold text-2xl line-clamp-2">
                    {q?.title}
                  </h1>
                  <p className=" text-center">{q?.desc}</p>
                  <div className="flex gap-4 text-xl">
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="bg-red-500 hover:scale-105 transition-transform duration-500 ease-in-out hover:bg-red-700 text-white p-0.5 cursor-pointer rounded w-18"
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500 hover:scale-105 transition-transform duration-500 ease-in-out hover:bg-blue-700 text-white p-0.5 cursor-pointer rounded w-18 "
                      onClick={() => handleEdit(q?._id)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleQuizStart(q?._id)}
                      className="bg-green-500 text-white p-0.5 cursor-pointer rounded w-fit  hover:scale-105 transition-transform duration-500 ease-in-out hover:bg-green-700"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-4xl  flex flex-col items-center justify-center  gap-4  ">
              <span>No Quiz Details!</span>
              <Link
                to="/quiz/create"
                className="border w-fit bg-[#008080] border-0 rounded outline-0 p-1 text-2xl cursor-pointer text-white hover:bg-[#015757] hover:scale-105 transition-all duration-300 "
              >
                Create Quiz
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="w-[20%] bg- p-2 shadow-lg rounded text-2xl h-fit absolute top-20 right-15">
        <MyStats />
        {/*  -- do it in future(2025/6/13)  */}
      </div>
  </>}
    </div>
  );
};

export default Dashboard;
