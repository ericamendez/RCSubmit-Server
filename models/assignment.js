import mongoose from 'mongoose';

const assigmentSchema = new mongoose.Schema({
    description: String,
    link: String,
    show: Boolean,
    week: String
})

export default mongoose.model('Assignment', assigmentSchema)