window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    
    setTimeout(() => {
        splash.classList.add('splash-hidden');
        
        setTimeout(() => {
            splash.remove();
        }, 500); 
    }, 1500);
});