import mongoose from "mongoose";

const quizDetailSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    desc: {
        type: String,
        required: true
    },
    noOfQues: {
        type: Number
    },
    quizType: {
        type: String
    },
    timeLimit: {
        type: Number
    },
    questions : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questions'
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
   
},
{timestamps: true});

export default mongoose.model('QuizDetail', quizDetailSchema);;