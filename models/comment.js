var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
   text: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"            // Refers to the model being referred to
      },
      username: String
   }
});

module.exports = mongoose.model("Comment", commentSchema);