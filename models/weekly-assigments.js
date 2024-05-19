import mongoose from 'mongoose';
/*
{
  _id: 'jjjjjkdlkkl'
  name: "Week 1",
  assignments: [
    {
      _id: 'wfnehkawhedj'
      name: "asisgnment name",
      show: false,
      weekID: 'jjjjjkdlkkl' ?
    }
  ]
  dueDate: 'Monday'
  currentWeek: false
}
*/
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  assignments: {
    type: Array,
    /*array of aissignment {
      name
      show?
    }*/
  },
  current: Boolean,
  dueDate: String,
})

module.exports = mongoose.model('Weekly-assignments', schema)