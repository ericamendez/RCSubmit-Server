import mongoose from 'mongoose';

const assigmentSchema = new mongoose.Schema({
    name: String,
    show: Boolean,
    weekID: String
})

module.exports = mongoose.model('Assigment', assignmentSchema)