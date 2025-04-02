import './../app.js';

class MatchView {
  renderMatchForm(userController, matchController) {
    const matchFormDiv = document.getElementById('match-form');
    matchFormDiv.innerHTML = `
      <label for="winner-id">Winner:</label>
      <select id="winner-id">
        ${this.getUserOptions(userController.users)}
      </select>
      <label for="loser-id">Loser:</label>
      <select id="loser-id">
        ${this.getUserOptions(userController.users)}
      </select>
      <button id="record-match">Record Match</button>
    `;

    const recordMatchButton = document.getElementById('record-match');
    recordMatchButton.addEventListener('click', () => {
      const winnerId = document.getElementById('winner-id').value;
      const loserId = document.getElementById('loser-id').value;

      if (!winnerId || !loserId) {
        alert('Please select both a winner and a loser.');
        return;
      }

      matchController.recordMatch(winnerId, loserId);

      // Update user list after recording match
      window.userView.renderUserList(userController.users);
      this.renderMatchForm(userController, matchController);
    });

    const winnerSelect = document.getElementById('winner-id');
    const loserSelect = document.getElementById('loser-id');

    winnerSelect.addEventListener('change', () => {
      this.updateLoserOptions(userController.users, winnerSelect.value);
    });

    loserSelect.addEventListener('change', () => {
      this.updateWinnerOptions(userController.users, loserSelect.value);
    });

    this.updateLoserOptions(userController.users, winnerSelect.value);
    this.updateWinnerOptions(userController.users, loserSelect.value);
  }

  updateWinnerOptions(users, loserId) {
    const winnerSelect = document.getElementById('winner-id');
    const selectedWinnerId = winnerSelect.value;
    winnerSelect.innerHTML = this.getUserOptions(users.filter(user => loserId ? user.id !== parseInt(loserId) : true));
    if (users.find(user => user.id === parseInt(selectedWinnerId))) {
      winnerSelect.value = selectedWinnerId;
    }
  }

  updateLoserOptions(users, winnerId) {
    const loserSelect = document.getElementById('loser-id');
    const selectedLoserId = loserSelect.value;
    loserSelect.innerHTML = this.getUserOptions(users.filter(user => winnerId ? user.id !== parseInt(winnerId) : true));
    if (users.find(user => user.id === parseInt(selectedLoserId))) {
      loserSelect.value = selectedLoserId;
    }
  }

  updateMatchFormOptions(users) {
    document.getElementById('winner-id').innerHTML = this.getUserOptions(users);
    document.getElementById('loser-id').innerHTML = this.getUserOptions(users);
  }

  getUserOptions(users) {
    return users
      .map(user => `<option value="${user.id}">${user.name}</option>`)
      .join('');
  }
}

export default MatchView;
