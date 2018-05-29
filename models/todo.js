const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
      item: {
        type: String,
        required: true,
      },
      priority: {
        type: Number,
        required: false
      },
      completed:{
        type: Boolean,
        required: true
      },
      user:{
        type: String,
        required: true
      }

})


const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
