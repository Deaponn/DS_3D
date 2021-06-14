import Main from './components/Main.js';

async function init() {
    //div
    const container = document.getElementById('root');
    //main class object
    let daneLevelu = await fetch('http://localhost:3000/level', { type: "GET" })
        .then(response => response.json())
    console.log(daneLevelu)
    new Main(container, daneLevelu);
}

init();