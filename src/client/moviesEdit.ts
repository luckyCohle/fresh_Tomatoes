document.addEventListener('DOMContentLoaded', () => {
    const editToggleBtn = document.getElementById('edit-toggle-btn') as HTMLButtonElement;
    const editFormContainer = document.getElementById('edit-form-container') as HTMLDivElement;
    const editBox = editFormContainer.querySelector('.edit-box') as HTMLDivElement;
  
    if (!editToggleBtn || !editFormContainer || !editBox) {
      console.error('Required elements not found');
      return;
    }
  
    editToggleBtn.addEventListener('click', () => {
      if (editFormContainer.classList.contains('d-none')) {
        // Show the form
        editFormContainer.classList.remove('d-none');
        setTimeout(() => {
          editBox.classList.add('visible');
        }, 10);
      } else {
        // Hide the form
        editBox.classList.remove('visible');
        setTimeout(() => {
          editFormContainer.classList.add('d-none');
        }, 300);
      }
    });
  });
  