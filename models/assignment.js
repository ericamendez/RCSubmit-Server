import mongoose from 'mongoose';

const assigmentSchema = new mongoose.Schema({
    description: String,
    link: String,
    show: Boolean,
    week: String,
    assignmentType: String,
    // read, fill out, watch, submitLink, submitZip, submitScreenshot
    dueDate: String
})

export default mongoose.model('Assignment', assigmentSchema)