import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionLaTeX: { type: String, required: true },
  answerLaTeX: { type: String, required: true },
});

const stageSchema = new mongoose.Schema({
  stageName: { type: String, required: true },
  stageId: { type: Number, required: true },
  questions: [questionSchema],
});

const CompetitionStage = mongoose.model('CompetitionStage', stageSchema);
export default CompetitionStage;
