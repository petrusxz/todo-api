const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  status: String,
  createdAt: Date,
  finishAt: Date,
});

itemSchema.pre('save', function (next) {
  if (!this.status) {
    this.status = 'open';
  }

  if (!this.createdAt) {
    this.createdAt = Date.now();
  }
  next();
});

itemSchema.pre('updateOne', function (next) {
  if (this._update.status === 'done') {
    this.set({ finishAt: Date.now() });
  }
  next();
});

itemSchema.methods.toResponse = function() {
  let obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;

  return obj;
}

module.exports = mongoose.model('item', itemSchema);