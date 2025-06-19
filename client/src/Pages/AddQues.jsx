import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { QuizContext } from "../Context/QuizContext";

const AddQues = () => {
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnsIndex: null,
    },
  ]);
  
  const [fillFields, setFillFields] = useState(false);
  const [startShrink, setStartShrink] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSelAns, setIsSelAns] = useState(false);
  const {
    isQuizEdit,
    quizDetails,
    questions: ques,
    sendQuestions,
    quiz,
    currentQuizIndex,
    setQuiz
  } = useContext(QuizContext);

const currentQuiz = quiz[currentQuizIndex] || {};
const quizDetail = currentQuiz.quizDetail || {};
const question = currentQuiz.questions[currentQuestionIndex];

  useEffect(() => {
    window.scrollTo({ top: 0 });

    if (isQuizEdit) {
      setQuestions([...ques]);
    }
  }, []);
  useEffect(() => {
    if ((currentQuestionIndex + 1) === parseInt(quizDetails?.noOfQues)) {
      setSubmit(true);
    }
    if (currentQuestionIndex === 0) {
      setCancel(true);
    } else {
      setCancel(false);
    }
  }, [currentQuestionIndex, submit, cancel]);

  const handleNext = (e) => {
     const formData = new FormData(e.target);
    // const {  option } = Object.fromEntries(formData);
    const optio = [
      formData.get('option-0'),
      formData.get('option-1'),
      formData.get('option-2'),
      formData.get('option-3')
    ]
    
    e.preventDefault();
    const { question, options, correctAnsIndex } = questions[currentQuestionIndex];
    if (
      question.length < 1 ||
      options[0].length < 1 ||
      options[1].length < 1 ||
      options[2].length < 1 ||
      options[3].length < 1
    ) {
      setFillFields(true);
      setTimeout(() => {
        setStartShrink(true);
      }, 50);
      setTimeout(() => {
        setFillFields(false);
        setStartShrink(false);
      }, 3000);
    } else if (questions[currentQuestionIndex]?.correctAnsIndex === null) {
      setIsSelAns(true);
      setFillFields(true);
      setTimeout(() => {
        setStartShrink(true);
      }, 50);
      setTimeout(() => {
        setFillFields(false);
        setStartShrink(false);
      }, 3000);
    } else {
      if (questions.length < quizDetail.noOfQues) {
        setQuestions((prev) => [
          ...prev,
          {
            question: "",
            options: ["", "", "", ""],
            correctAnsIndex: null,
          },
        ]);

        setQuiz(prev => {
          //copy of entire quiz
          const updated = [...prev];
          //copy of current quiz
          const currentQuiz = {...updated[currentQuizIndex]};
          //copy of current quiz questions array
          const updatedQuestions = [...currentQuiz.questions];

          //update the specific question at currentQuesIndex
          updatedQuestions[currentQuestionIndex] ={
            ...questions[currentQuestionIndex],
          };

          //assign updated questions array back to the current quiz obj
          currentQuiz.questions = updatedQuestions;

          //assign updated quiz back to updated array
          updated[currentQuizIndex] =  currentQuiz;

          return updated;
        })
      }
        setCurrentQuestionIndex((prev) => prev + 1);

    }
  };
  const handleQuestionChange = (key, value) => {
    setQuestions((prev) => {
      const updated = [...prev];

      updated[currentQuestionIndex] = {
        ...updated[currentQuestionIndex],

        [key]: value,
      };

      return updated;
    });
  };
  const handleCorrectAns = (index) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = {
        ...updated[currentQuestionIndex],
        correctAnsIndex: index,
      };
      return updated;
    });
  };

  const handleBack = () => {
   
    if (currentQuestionIndex !== 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
    setSubmit(false);
  };
  const handlePreview = () => {
    const { question, options, correctAns } = questions[currentQuestionIndex];

    if (
      question.length < 1 ||
      options[0].length < 1 ||
      options[1].length < 1 ||
      options[2].length < 1 ||
      options[3].length < 1
    ) {
      setFillFields(true);
      setSubmit(false);
      setTimeout(() => {
        setStartShrink(true);
      }, 50);
      setTimeout(() => {
        setFillFields(false);
        setStartShrink(false);
      }, 3000);
    } else if (questions[currentQuestionIndex]?.correctAnsIndex === null) {
      setIsSelAns(true);
      setFillFields(true);
      setTimeout(() => {
        setStartShrink(true);
      }, 50);
      setTimeout(() => {
        setFillFields(false);
        setStartShrink(false);
      }, 3000);
    } else {
      sendQuestions(questions);
    }
  };

  return (
    <div className="h-[100vh] flex flex-col items-center gap-5">
      <div
        className={`bg-red-500 p-1 text-white absolute w-fit left-170 bottom-0 rounded text-xl transition-all duration-500 ease-in-out  ${
          fillFields
            ? " opacity-100 bottom-22 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <p>
          {!isSelAns
            ? "Please fill all the required fields!"
            : "Please choose the correct ans!"}{" "}
        </p>
        {startShrink && (
          <span className="h-[2px] block w-full bg-yellow-200 animate-shrink-bar"></span>
        )}
      </div>
      <h1 className="ml-20 mt-5 text-3xl font-bold ">
       {isQuizEdit ? 'Edit' :  "Add " +quizDetail?.noOfQues} Questions
      </h1>
      <h2 className="font-bold text-2xl absolute left-103 top-38">
        Category: {quizDetail?.title}
      </h2>
      <form className="ml-20 mt-10 border w-200 p-5 rounded bg-white shadow-lg border-0 flex flex-col text-2xl space-y-5" onSubmit={handleNext}>
        <div className="flex justify-between font-bold">
          <h1 className="flex flex-col">
            Question No. {currentQuestionIndex + 1}
          </h1>
        </div>
        <label htmlFor="questio" />
        <input
          type="text"
          name="questio"
          className="bg-gray-200 p-2 rounded outline-0 w-full"
          placeholder="Write question here"
          required
        />

        <ul className="space-y-5">
        
          {question.options.map((opt, idx) => (
            <div className="flex items-center gap-2 relative" key={idx}>
            <label htmlFor={`option-${idx}`} />
              <input
                type="text"
                name={`option-${idx}`}
                required
                className="bg-gray-200 p-1 text-[22px] w-full rounded outline-0"
                placeholder={`Option${idx + 1}`}
                maxLength={60}
              />
              <div className="flex items-center justify-center gap-2 text-xl absolute right-5 text-gray-500">
                <label htmlFor="correctAns">Correct Answer</label>
                <input
                  type="radio"
                  className="cursor-pointer"
                  name={`correctAns-${currentQuestionIndex}`}
                  onChange={() => handleCorrectAns(idx)}
                  checked={questions[currentQuestionIndex]?.correctAnsIndex === idx}
                />
              </div>
            </div>
          ))}
        </ul>
        <div className="flex justify-between mt-5">
          {cancel ? (
            <Link
              to="/quiz/create"
              type="button"
              className="border p-1 text-center  w-20 bg-red-500 text-white border-0 rounded cursor-pointer hover:bg-red-700"
            >
              Cancel
            </Link>
          ) : (
            <button
              onClick={handleBack}
              type="button"
              className="border p-1 text-center  w-20 bg-red-500 text-white border-0 rounded cursor-pointer hover:bg-red-700"
            >
              Back
            </button>
          )}
          {submit ? (
            <button
              type="button"
              onClick={handlePreview}
              className="outline-0 p-1 text-center  w-fit bg-green-500 text-white border-0 rounded cursor-pointer hover:bg-green-700"
            >
              Save & Preview
            </button>
          ) : (
            <button
              
              className="outline-0 p-1 text-center  w-20 bg-green-500 text-white border-0 rounded cursor-pointer hover:bg-green-700"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddQues;
