import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const QuizContext = createContext();

export const QuizContextProvider = ({ children }) => {
  const [quiz, setQuiz] = useState(() => {
    const savedQuiz = localStorage.getItem("quizData");
    return savedQuiz
      ? JSON.parse(savedQuiz)
      : [
          {
            quizDetail: {
              title: "",
              desc: "",
              noOfQues: 2,
              type: "MCQ",
              timeLimit: null,
            },
            questions: [
              {
                question: "",
                options: ["", "", "", ""],
                correctAnsIndex: null,
              },
            ],
          },
        ];
  });
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [isQuizEdit, setIsQuizEdit] = useState(false);
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isQuizEdit) {
      nav("/quiz/edit/quizDetail");
    }
  }, [isQuizEdit]);

  useEffect(() => {
    localStorage.setItem("quizData", JSON.stringify(quiz));
  }, [quiz]);

  useEffect(() => {
    const savedQuiz = localStorage.getItem("quizData");
    if (savedQuiz) {
      setQuiz(JSON.parse(savedQuiz));
    }
  }, []);

  useEffect(() => {
    // get the page load info from performance api
    const navEntries = performance.getEntriesByType("navigation");
    //check the page is load by reload
    const isReload = navEntries[0]?.type === "reload";
    const handleTabClose = (e) => {
      //if not it is tab or browser close - remove the data from local storage
      if (!isReload) {
        localStorage.removeItem("quizData");
      }
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  //quiz data to handle when navigation changes
  useEffect(() => {
    const currentPath = location.pathname;

    const isCreatePath = currentPath.startsWith("/quiz/create");
    const isAddQuesPath = currentPath.startsWith("/quiz/create/addQues");
    const isPreviewPath = currentPath.startsWith("/quiz/preview");
    const isEditDashboardQuizDetailPath = currentPath.startsWith(
      "/quiz/edit/quizDetail"
    );
    const isEditDashboardQuesPath = currentPath.startsWith("/quiz/edit/ques");

    if (
      !isCreatePath &&
      !isAddQuesPath &&
      !isPreviewPath &&
      !isEditDashboardQuizDetailPath &&
      !isEditDashboardQuesPath
    ) {
      localStorage.removeItem("quizData");

      setQuiz([
        {
          quizDetail: {
            title: "",
            desc: "",
            noOfQues: 2,
            type: "MCQ",
            timeLimit: null,
          },
          questions: [
            {
              question: "",
              options: ["", "", "", ""],
              correctAnsIndex: null,
            },
          ],
        },
      ]);
    }
  }, [location]);
  return (
    <QuizContext.Provider
      value={{
        quiz,
        setQuiz,
        setIsQuizEdit,
        isQuizEdit,
        currentQuizIndex,
        setCurrentQuizIndex
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
