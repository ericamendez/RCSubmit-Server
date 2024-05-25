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
  week: {
    type: Number,
    required: true,
    unique: true
  },
  assignments: {
    type: Array,
    /*array of aissignment {
      name
      show?
      weekID
    }*/
  },
  current: Boolean,
  dueDate: String,
})

export default mongoose.model('Weekly-assignments', schema)