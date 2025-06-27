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
    quiz,
    currentQuizIndex,
    setQuiz,
  } = useContext(QuizContext);
  const nav = useNavigate();
  const currentQuiz = quiz[currentQuizIndex] || {};
  const quizDetail = currentQuiz.quizDetail || {};
  const question = questions[currentQuestionIndex];
  const options = question?.options || [];

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (isQuizEdit) {
      setQuestions([...questions]);
    }
  }, []);
  useEffect(() => {
    if (currentQuiz?.questions?.length) {
      setQuestions([...currentQuiz.questions]);
    }
  }, [quiz, currentQuizIndex]);
  useEffect(() => {
    if (currentQuestionIndex + 1 === parseInt(quizDetail?.noOfQues)) {
      setSubmit(true);
    }
    if (currentQuestionIndex === 0) {
      setCancel(true);
    } else {
      setCancel(false);
    }
  }, [currentQuestionIndex, submit, cancel]);
  const handleNext = (e) => {
    e.preventDefault();
    // const { question, options, correctAnsIndex } = question;
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
      return;
    } 
     if (question?.correctAnsIndex === null) {
      setIsSelAns(true);
      setFillFields(true);
      setTimeout(() => {
        setStartShrink(true);
      }, 50);
      setTimeout(() => {
        setFillFields(false);
        setStartShrink(false);
      }, 3000);
      return;
    } 

    // if(!isQuizEdit){
      const updatedQuestions = [...questions];

      if (questions.length < quizDetail.noOfQues) {

        updatedQuestions.push({
          question: '',
          options: ['', '', '', ''],
          correctAnsIndex: null,
        });
      }

      //here should i do
        setQuestions(updatedQuestions);
          setQuiz((prev) => {
        const updated = [...prev];

        updated[currentQuizIndex] = {
          ...updated[currentQuizIndex],
          questions: updatedQuestions,
        };

        return updated;
      });
    // }

      setCurrentQuestionIndex((prev) => prev + 1);
    
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
  const handleOptionChange = (idx, value) => {
    setQuestions((prevQuestions) => {
      // Step 1: Create a shallow copy of the entire questions array
      const updatedQuestions = [...prevQuestions];

      // Step 2: Create a copy of the current question object
      const currentQuestion = { ...updatedQuestions[currentQuestionIndex] };

      // Step 3: Create a copy of the options array and update the value
      const updatedOptions = [...currentQuestion.options];
      updatedOptions[idx] = value;

      // Step 4: Update the options in the copied question
      currentQuestion.options = updatedOptions;

      // Step 5: Replace the question at the current index with the updated one
      updatedQuestions[currentQuestionIndex] = currentQuestion;

      // Step 6: Return the new questions array to update state
      return updatedQuestions;
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
      setQuiz((prev) => {
        const updated = [...prev];


        updated[currentQuizIndex] = {
          ...updated[currentQuizIndex],
          questions: [...questions],
        };

        return updated;
      });
      nav("/quiz/preview");
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
        {isQuizEdit ? "Edit" : "Add " + quizDetail?.noOfQues} Questions
      </h1>
      <h2 className="font-bold text-2xl absolute left-103 top-38">
        Category: {quizDetail?.title}
      </h2>
      <form
        className="ml-20 mt-10 border w-200 p-5 rounded bg-white shadow-lg border-0 flex flex-col text-2xl space-y-5"
        onSubmit={handleNext}
      >
        <div className="flex justify-between font-bold">
          <h1 className="flex flex-col">
            Question No. {currentQuestionIndex + 1}
          </h1>
        </div>
        <input
          type="text"
          className="bg-gray-200 p-2 rounded outline-0 w-full"
          placeholder="Write question here"
          value={question?.question}
          onChange={(e) => handleQuestionChange("question", e.target.value)}
          required
        />

        <ul className="space-y-5">
          {questions[currentQuestionIndex]?.options?.map((opt, idx) => {
            return (
              <div className="flex items-center gap-2 relative" key={idx}>
                <input
                  type="text"
                  required
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="bg-gray-200 p-1 text-[22px] w-full rounded outline-0"
                  placeholder={`Option${idx + 1}`}
                  maxLength={60}
                />
                <div className="flex items-center justify-center gap-2 text-xl absolute right-5 text-gray-500">
                  <label>Correct Answer</label>
                  <input
                    type="radio"
                    className="cursor-pointer"
                    name="correctAns"
                    onChange={() => handleCorrectAns(idx)}
                    checked={question?.correctAnsIndex === idx}
                  />
                </div>
              </div>
            );
          })}
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
            <button className="outline-0 p-1 text-center  w-20 bg-green-500 text-white border-0 rounded cursor-pointer hover:bg-green-700">
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddQues;
