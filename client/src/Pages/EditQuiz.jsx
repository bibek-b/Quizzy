import { useContext, useEffect, useState } from "react";
import CreateQuiz from "./CreateQuiz";
import { useLocation } from "react-router-dom";
import { QuizContext } from "../Context/QuizContext";

const EditQuiz = () => {
  return (
    <div>
      <CreateQuiz  />
    </div>
  );
};

export default EditQuiz;
