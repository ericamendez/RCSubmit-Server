import mongoose from "mongoose";

const schema = new mongoose.Schema({
    week: Number,
    assignments: [],
})

export default mongoose.model('Submission', schema)