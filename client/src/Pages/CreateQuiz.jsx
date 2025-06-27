import { useContext, useEffect, useState } from "react";
import { QuizContext } from "../Context/QuizContext";
import { useNavigate } from "react-router-dom";
const CreateQuiz = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [fillFields, setFillFields] = useState(false);
  const [startShrink, setStartShrink] = useState(false);
  const nav = useNavigate();

  const { isQuizEdit, setQuiz, currentQuizIndex, quiz } =
    useContext(QuizContext);

  const currentQuiz = quiz[currentQuizIndex] || {};
  const quizDetail = currentQuiz?.quizDetail || {};
  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (isQuizEdit) {
      if (currentQuiz?.timeLimit) {
        setIsChecked(true);
      }
    }
  }, []);

  //reset time limit if there is time limit after user unchecked the time limit
  useEffect(() => {
    if (!isChecked) {
      setQuiz((prev) => {
        const updated = [...prev];

        updated[currentQuizIndex] = {
          ...updated[currentQuizIndex],
          timeLimit: 0
        };

        return updated;
      });
    }
  }, [isChecked]);



  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const formValues = Object.fromEntries(formData);

    if (
      formValues.desc.trim().length < 1 ||
      formValues.title.trim().length < 1
    ) {
      setFillFields(true);

      setTimeout(() => {
        setStartShrink(true);
      }, 50);
      setTimeout(() => {
        setFillFields(false);
        setStartShrink(false);
      }, 3000);
    } else {
      const quizDetail = {
        title: formValues.title,
        desc: formValues.desc,
        noOfQues: Number(formValues.noOfQues),
        type: formValues.type,
        timeLimit: Number(formValues.timeLimit),
      };
      setQuiz((prev) => {
        const updated = [...prev];
        updated[currentQuizIndex] = {
          ...updated[currentQuizIndex],
          quizDetail,
        };
        return updated;
      });
      if (isQuizEdit) {
        nav("/quiz/edit/ques");
      } else {
        nav("/quiz/create/addQues");
      }
    }
  };
  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="h-[100vh]">
      <div
        className={`bg-red-500 p-1 text-white absolute w-fit left-100 top-0 rounded text-xl transition-all duration-500 ease-in-out  ${
          fillFields
            ? " opacity-100 top-30 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <p>Please fill all the required fields!</p>
        {startShrink && (
          <span className="h-[2px] block w-full bg-yellow-200 animate-shrink-bar"></span>
        )}
      </div>
      <h1 className="ml-20 mt-15 text-3xl font-bold ">
        {isQuizEdit ? "Edit" : "Create"} Quiz
      </h1>
      <form
        className="ml-20 mt-10 border w-200 p-5 rounded bg-white shadow-lg border-0 flex flex-col text-2xl space-y-5"
        onSubmit={(e) => handleSubmit(e)}
      >
        <label htmlFor="title" className="font-bold ">
          Title
        </label>
        <input
          name="title"
          className=" outline-0 rounded  text-[22px] bg-gray-300 p-2"
          placeholder="Quiz title"
          min={20}
          defaultValue={quizDetail?.title || currentQuiz?.title}
        />
        <label htmlFor="description" className="font-bold">
          Description
        </label>
        <textarea
          type="text"
          name="desc"
          placeholder="Enter description here"
          className="outline-0 rounded p-2  bg-gray-300 text-[22px] resize-none "
          rows={2}
          defaultValue={quizDetail?.desc || currentQuiz?.desc}
        />

        <div className="flex justify-between ">
          <div className="flex flex-col  gap-2">
            <label htmlFor="noOfQues" className="font-bold">
              Number of Questions
            </label>
            <input
              type="number"
              name="noOfQues"
              placeholder="2"
              className="outline-0 rounded p-2  bg-gray-300 text-[22px] w-35"
              min={2}
              defaultValue={quizDetail?.noOfQues || currentQuiz?.noOfQues || 2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="font-bold">
              Type
            </label>
            <select
              name="type"
              className="outline-0 rounded p-2  bg-gray-300 text-[22px]  w-35"
            >
              <option value="MCQ">{currentQuiz?.type || "MCQ"}</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2">
              <input
                type="checkbox"
                className="w-[17px] h-[17px]"
                onChange={(e) => setIsChecked(e.target.checked)}
                checked={isChecked}
              />
              <label htmlFor="timeLimit" className="font-bold">
                Time Limit
              </label>
            </div>
            <div className="flex ">
              <input
                defaultValue={quizDetail?.timeLimit || currentQuiz?.timeLimit}
                type="number"
                name="timeLimit"
                placeholder="in minutes"
                required
                className="outline-0 rounded p-2  bg-gray-300 text-[22px]  w-[140px]"
                disabled={!isChecked}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-5">
          <button
            onClick={handleCancel}
            type="button"
            className="border p-1 text-center  w-20 bg-red-500 text-white border-0 rounded cursor-pointer hover:bg-red-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="border p-1 text-center  w-20 bg-green-500 text-white border-0 rounded cursor-pointer hover:bg-green-700"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
