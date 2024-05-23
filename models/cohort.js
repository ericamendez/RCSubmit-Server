import mongoose from "mongoose";

const cohortSchema = new mongoose.Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    isCurrentCohort: Boolean,
    currentWeek: Number,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
})

export default mongoose.model('Cohort', cohortSchema)