import mongoose from "mongoose";

const schema = new mongoose.Schema({
    userID: String,
    assignmentID: String,
    assignmentType: String,
    assignmentFile: String,
    week: Number,
    link: String,
    isSubmitted: Boolean,
})

export default mongoose.model('Submission', schema)