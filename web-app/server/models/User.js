const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid']
  },
  password: {
    type: String,
    required: [true, "can't be blank"]
  },
  role: Number
});

UserSchema.pre('save', function(next) {
  const SALTROUNDS = 10; // or another integer in that ballpark
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALTROUNDS, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, SALTROUNDS, (error, hash) => {
      if (error) {
        return next(error);
      }

      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
