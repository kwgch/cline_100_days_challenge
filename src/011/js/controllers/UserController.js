import User from '../models/User.js';

class UserController {
  constructor(matchView) {
    this.users = this.getUsers() || [];
    this.nextId = this.users.length > 0 ? Math.max(...this.users.map(user => user.id)) + 1 : 1;
    this.matchView = matchView;
    this.dummyUsersAdded = localStorage.getItem('dummyUsersAdded') === 'true';
  }

  addUser(name) {
    const newUser = new User(this.nextId, name, 1500);
    this.users.push(newUser);
    this.nextId++;
    this.saveUsers();
    this.matchView.updateMatchFormOptions(this.users);
    return this.users;
  }

  clearData() {
    localStorage.clear();
    this.users = [];
    this.nextId = 1;
    this.dummyUsersAdded = false;
    localStorage.setItem('dummyUsersAdded', 'false');
    this.saveUsers();
    this.matchView.updateMatchFormOptions(this.users);
  }

  getUsers() {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers).map(user => new User(user.id, user.name, user.rating)) : [];
  }

  saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  addDummyUsers() {
    if (this.dummyUsersAdded) {
      return this.users;
    }

    const dummyUsers = [
      { id: this.nextId++, name: 'Alice', rating: 1500 },
      { id: this.nextId++, name: 'Bob', rating: 1600 },
      { id: this.nextId++, name: 'Charlie', rating: 1400 },
    ];
    this.users.push(...dummyUsers.map(user => new User(user.id, user.name, user.rating)));
    this.saveUsers();
    this.matchView.updateMatchFormOptions(this.users);
    this.dummyUsersAdded = true;
    localStorage.setItem('dummyUsersAdded', 'true');
    return this.users;
  }
}

export default UserController;
