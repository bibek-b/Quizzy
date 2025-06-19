import QuestionsModel from "../Models/QuestionsModel.js";
import QuizDetailModel from "../Models/QuizDetailModel.js";
import UserModel from "../Models/UserModel.js";

export const getAllQuiz = async (req, res) => {
  try {
    const allQuiz = await QuizDetailModel.find();
    return res.status(200).json(allQuiz);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to get all quiz!" });
  }
};

export const getQuiz = async (req, res) => {
  try {
    const quiz = await QuizDetailModel.findById(req.params.quizId);

    if (!quiz) return res.status(409).json({ error: "Quiz not found!" });

    return res.status(200).json(quiz);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to get  quiz!" });
  }
};

//get all quiz of a user
export const getAllQuizOfUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const quizes = await QuizDetailModel.find({ userId }).populate(
      "questions"
    );
    if (!quizes) return res.status(409).json({ error: "No quiz found!" });

    return res.status(200).json(quizes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to get quiz of user!" });
  }
};

export const addQuiz = async (req, res) => {
  const { quizDetail, questions, userId } = req.body;
  console.log(questions)
  try {
    const insertedQuestions = await QuestionsModel.insertMany(questions);
    const questionIds = insertedQuestions.map((i) => i._id);
    console.log(questionIds)
    if (!userId) return res.status(404).json({ Error: "User id is required!" });

    const newQuiz = await QuizDetailModel.create({
      title: quizDetail.title,
      desc: quizDetail.desc,
      noOfQues: quizDetail.noOfQues,
      quizType: quizDetail.quizType || "MCQ",
      timeLimit: quizDetail.timeLimit,
      questions: questionIds,
      userId,
    });
    return res.status(200).json({
      message: "Quiz created successfully!",
      quiz: newQuiz,
      // questions: insertedQuestions,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to add quiz!" });
  }
};

export const updateQuiz = async (req, res) => {
  const { quizDetail, questionDetails, userId } = req.body;
  try {
    const quiz = await QuizDetailModel.findById(req.params.id);
    if (!quiz) {
      return res.status(409).json({ error: "Quiz not found!" });
    }

    const isValidUser = await QuizDetailModel.find({ userId });

    if (!isValidUser || !userId)
      return res.status(409).json({ error: "Invalid user to update!" });

    const updatedQuestionIds = [];

    for (const question of questionDetails) {
      if (question._id) {
        await QuestionsModel.findByIdAndUpdate(question._id, {
          $set: {
            question: question.question,
            options: question.options,
            correctAnsIndex: question.correctAnsIndex,
          },
        });
        updatedQuestionIds.push(question._id);
      } else {
        const newQuestion = await QuestionsModel.create({
          question: question.question,
          options: question.options,
          correctAnsIndex: question.correctAnsIndex,
        });

        updatedQuestionIds.push(newQuestion._id);
      }
    }

    const updatedQuiz = await QuizDetailModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: quizDetail.title,
          desc: quizDetail.desc,
          quizType: quizDetail.quizType,
          timeLimit: quizDetail.timeLimit,
          noOfQues: quizDetail.noOfQues,
          questionIds: updatedQuestionIds,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Quiz Updated successfully with questions!",
      quiz: updatedQuiz,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to update quiz!" });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await QuizDetailModel.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found!" });

    const questionIds = quiz.questionIds;
    await QuestionsModel.deleteMany({ _id: { $in: questionIds } });
    await QuizDetailModel.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json({ message: "Quiz & its questions deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to delete quiz!" });
  }
};

export const deleteAllQuiz = async (req, res) => {
  try {
    await QuestionsModel.deleteMany();
    await QuizDetailModel.deleteMany();

    return res
      .status(200)
      .json({ message: "All Quiz & questions deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to delete all quiz!" });
  }
};
