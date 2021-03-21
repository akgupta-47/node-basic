const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSignToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  //send the token
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });

  createSignToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if user has entered a password and email
  if (!email || !password) {
    return next(new AppError('Please enter your email and password', 400));
  }
  // check if what they entered actually exists
  const user = await User.findOne({ email }).select('+password');
  // we do not put the call the correct password statement from separate variable, as if user doesn't exist then user.password doesnot exist that causes error
  // const correct = await user.correctPassword(password, user.password;

  // check if user exists and the password is correct
  // correctPaasword(password enters(unhashed), password in database(hashed))
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('invalid email or password', 401)); // 401 is authorisation erroe
  }

  // if everything is ok send token to the client
  createSignToken(user, 200, res);
});

// protect routes
exports.protect = catchAsync(async (req, res, next) => {
  // getting token and check if it is theres
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    //console.log(token);
  }
  if (!token) {
    return next(
      new AppError('You are not logged in, log in to get access!!', 401)
    );
  }
  // Token verification and if no one changed the token
  // jwt.verify is a sync function without callback, so we need make it async
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  // here as payload contains the id, so decoded.id will give us the id of document
  // check if user has not been deleted for the userfor whome the token was issued
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('the token belonging to the user does not exist', 401)
    );
  }

  // check if user changed password after token was issued
  // check if password changed after is greater than token issued at time
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Use the recently changed password and login again', 401)
    );
  }

  // // Grant acess to protected route
  // req.user = currentUser;
  // res.locals.user = currentUser;
  next();
});
