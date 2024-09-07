"use strict";
let btn = document.getElementById('login');
btn.addEventListener('click', () => {
    btn.innerText = 'Loading...';
    setTimeout(() => {
        btn.innerHTML = 'Login';
    }, 5000);
});
