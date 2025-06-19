import express from 'express';
import { addQuiz, deleteAllQuiz, deleteQuiz, getAllQuiz, getAllQuizOfUser, getQuiz, updateQuiz } from '../Controller/quizController.js';

const router = express.Router();

router.get('/', getAllQuiz)
router.get('/:userId', getAllQuizOfUser);
router.post('/add', addQuiz);
router.put('/update/:id', updateQuiz);
router.delete('/delete/:id', deleteQuiz);
router.delete('/deleteAll', deleteAllQuiz);

export default router;
