import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import CreateQuiz from "./Pages/CreateQuiz";
import AddQues from "./Pages/AddQues";
import Dashboard from "./Pages/Dashboard";
import PlayQuiz from "./Pages/PlayQuiz";
import QuizPlaying from "./Pages/QuizPlaying";
import PreviewQuiz from "./Pages/PreviewQuiz";
import EditQuiz from "./Pages/EditQuiz";
import EditQues from "./Pages/EditQues";
import Register from "./Pages/Register";
import Login from "./Pages/Login";

const App = () => {
  return (
    // <BrowserRouter>
      <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />}/>
          <Route path="/user/dashboard" element={<Dashboard />} />
          <Route path="/quiz/create" element={<CreateQuiz />} />
          <Route path="/quiz/edit/quizDetail" element={<EditQuiz />} />
          <Route path="/quiz/create/addQues" element={<AddQues />} />
          <Route path="/quiz/edit/ques" element={<EditQues />} />
          <Route path="/quiz/preview" element={<PreviewQuiz />} />
          <Route path="/quiz/play" element={<PlayQuiz />} />
          <Route path="/quiz/play/:quizDetails" element={<QuizPlaying />} />
          </Route>
      </Routes>
    // </BrowserRouter>
  )
}

export default App