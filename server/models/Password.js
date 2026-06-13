const mongoose = require("mongoose");

const PasswordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    default: function() {
      return this.website;
    }
  },
  website: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Password", PasswordSchema);
