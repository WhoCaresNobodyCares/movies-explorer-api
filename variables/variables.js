const signupValidationMessage = 'Signup controller: validation error';
const signupConflictMessage = 'Signup controller: this user is already registered';
const signupServerMessage = 'Signup controller: server error';

const signinUnauthorizedMessage = 'Signin controller: wrong email or password';
const signinServerMessage = 'Signin controller: server error';

const getMoviesServerMessage = 'GetMovies controller: server error';

const createMovieValidationMessage = 'CreateMovie controller: validation error';
const createMovieServerMessage = 'CreateMovie controller: server error';

const deleteMovieServerMessage = 'DeleteMovie controller: server error';
const deleteMovieNotFoundMessage = 'DeleteMovie controller: the movie is not found';
const deleteMovieRightsViolationMessage = 'DeleteMovie controller: it is not your movie to delete';

const getUserNotFoundMessage = 'GetUser controller: user is not found';
const getUserServerMessage = 'GetUser controller: server error';

const changeUserConflictMessage = 'ChangeUser controller: this email is busy';
const changeUserValidationMessage = 'ChangeUser controller: validation error';
const changeUserServerMessage = 'ChangeUser controller: server error';

const authEmptyTokenMessage = 'Auth middleware: empty authorization token';
const authWrongTokenMessage = 'Auth middleware: wrong authorization token';

module.exports = {
  signupValidationMessage,
  signupConflictMessage,
  signupServerMessage,
  signinUnauthorizedMessage,
  signinServerMessage,
  getMoviesServerMessage,
  createMovieValidationMessage,
  createMovieServerMessage,
  deleteMovieServerMessage,
  deleteMovieRightsViolationMessage,
  deleteMovieNotFoundMessage,
  getUserNotFoundMessage,
  getUserServerMessage,
  changeUserConflictMessage,
  changeUserValidationMessage,
  changeUserServerMessage,
  authEmptyTokenMessage,
  authWrongTokenMessage,
};
