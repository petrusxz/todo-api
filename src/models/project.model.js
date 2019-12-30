const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  createdAt: Date,
});

projectSchema.pre('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = Date.now();
  }
  next();
});

projectSchema.methods.toResponse = function() {
  let obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;

  return obj;
}

module.exports = mongoose.model('project', projectSchema);
