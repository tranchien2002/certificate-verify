const mongoose = require('mongoose');
const { Schema } = mongoose;

const CertSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "can't be blank"]
  },
  course: {
    type: String,
    required: [true, "can't be blank"]
  },
  issueDate: {
    type: String,
    required: [true, "can't be blank"]
  },
  signature: {
    type: String,
    required: [true, "can't be blank"]
  }
});

const Cert = mongoose.model('Cert', CertSchema);

module.exports = Cert;
