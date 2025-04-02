// Import necessary modules
import User from './models/User.js';
import EloRating from './models/EloRating.js';
import UserView from './views/UserView.js';
import MatchView from './views/MatchView.js';
import UserController from './controllers/UserController.js';
import MatchController from './controllers/MatchController.js';

function initializeModules() {
  window.userView = new UserView();
  const matchView = new MatchView();
  const userController = new UserController(matchView);
  const matchController = new MatchController(userController);

  // Initial render
  window.userView.renderUserForm(userController);
  window.userView.renderUserList(userController.users);
  matchView.renderMatchForm(userController, matchController);
}

initializeModules();
