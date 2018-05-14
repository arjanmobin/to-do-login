const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
      item: {
        type: String,
        required: true,
      },
      completed:{
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    priority: {
        type: Number,
        required: false
    }
})


const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
