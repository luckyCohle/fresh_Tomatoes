let btn  = document.getElementById('login') as HTMLFormElement ;
btn.addEventListener('click',()=>{
    btn.innerText = 'Loading...';
    setTimeout(() => {
        btn.innerHTML='Login';
    }, 5000);
});