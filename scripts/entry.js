const submit = document.querySelector('#submit');
submit.addEventListener('click', () => {
    const input = document.querySelector('.select_type select');
    if (input) {
        const value = input.value;
        localStorage.setItem('topic', value);
        window.location.href = 'index.html';
    }
});

const ignore = document.querySelector('#ignore');
ignore.addEventListener('click', () => {
    localStorage.setItem('topic', 'ignore');
    window.location.href = 'index.html';
});