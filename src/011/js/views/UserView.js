class UserView {
  renderUserList(users) {
    const userListDiv = document.getElementById('user-list');
    userListDiv.innerHTML = '';

    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        ${users
          .sort((a, b) => b.rating - a.rating)
          .map(
            (user, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.rating.toFixed(2)}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    `;
    userListDiv.appendChild(table);
  }

  renderUserForm(userController) {
    const userFormDiv = document.getElementById('user-form');
    userFormDiv.innerHTML = `
      <input type="text" id="new-user-name" placeholder="User name">
      <button id="add-user">Add User</button>
      <button id="add-dummy-users">Add Dummy Users</button>
      <button id="clear-data">Clear Data</button>
    `;

    document.getElementById('add-user').addEventListener('click', () => {
      const name = document.getElementById('new-user-name').value;
      if (name) {
        userController.addUser(name);
        this.renderUserList(userController.users);
        document.getElementById('new-user-name').value = '';
      }
    });

    document.getElementById('add-dummy-users').addEventListener('click', () => {
      userController.addDummyUsers();
      this.renderUserList(userController.users);
    });

    document.getElementById('clear-data').addEventListener('click', () => {
      userController.clearData();
      this.renderUserList(userController.users);
    });
  }
}

export default UserView;
