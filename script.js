const board= document.querySelector('.board');
const startButton= document.querySelector('.btn-start');

const startGameModal= document.querySelector('.start-game');
const gameOverModal= document.querySelector('.game-over');
const restartButton= document.querySelector('.btn-restart');

const modal= document.querySelector('.modal');
const blockHeight= 50;
const blockWidth= 50;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const moveSound = new Audio('./audio/snake_move.wav');
const foodSound = new Audio('./audio/snake_food.wav');
const gameOverSound = new Audio('./audio/snake_game_over.wav');

moveSound.volume =0.5;
foodSound.volume = 0.5;
gameOverSound.volume = 0.5;

let highscore=localStorage.getItem('highscore') || 0;
let score=0;
let time='00:00';


const highScoreElement= document.querySelector('#high-score');

const scoreElement= document.querySelector('#score');

const timeElement= document.querySelector('#time');


highScoreElement.innerText= highscore;



const blocks= [];
let intervalId=null;
let timerId=null;

let food={x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};

let snake= [{
    x:1,y:3
}];


let direction= 'down';

// for(let i=0; i<rows * cols; i++){
//     const block= document.createElement('div');
//     block.classList.add('block');  
//     board.appendChild(block);
// }

for(let row=0; row<rows; row++){
    for(let col=0; col<cols; col++){
        const block= document.createElement('div');
        block.classList.add('block');  
        board.appendChild(block);
       
        blocks[`${row}, ${col}`]= block;
    }
}

function render(){
      let head= null;


      blocks[`${food.x}, ${food.y}`].classList.add('food');

    if(direction==='left'){
        head= {x: snake[0].x, y: snake[0].y-1};


    } else if(direction==='right'){
        head= {x: snake[0].x, y: snake[0].y+1};
    } else if(direction==='up'){
        head= {x: snake[0].x-1, y: snake[0].y};
    } else if(direction==='down'){
        head= {x: snake[0].x+1, y: snake[0].y};
    }

    moveSound.currentTime = 0;
    moveSound.play();

    if(head.x<0 || head.x>=rows || head.y<0 || head.y>=cols){
        
        clearInterval(intervalId);
         gameOverSound.currentTime = 0;
        gameOverSound.play();

        modal.style.display = 'flex';
        startGameModal.style.display = 'none';
        gameOverModal.style.display = 'flex';

        return;
    }
     const isColliding = snake.some(segment =>
        head.x === segment.x && head.y === segment.y
    );

    if (isColliding) {
        clearInterval(intervalId);
        clearInterval(timerId);

        modal.style.display = 'flex';
        startGameModal.style.display = 'none';
        gameOverModal.style.display = 'flex';

        return;
    }
 

    // food consume logic
    if(head.x===food.x && head.y===food.y){
        foodSound.currentTime = 0;
        foodSound.play().catch((error) => {
            console.error('Error playing food sound:', error);
        })

        blocks[`${food.x}, ${food.y}`].classList.remove('food');

        food={x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};

        snake.unshift(head);
        score += 10;
        scoreElement.textContent = score;

        if(score > highscore){
            highscore = score;
            localStorage.setItem('highscore', highscore.toString());
            highScoreElement.textContent = highscore;
        }
    }

    snake.forEach((segment)=>{
       blocks[`${segment.x}, ${segment.y}`].classList.remove("fill");
    })
        snake.unshift(head);
        snake.pop();

    snake.forEach((segment)=>{
        blocks[`${segment.x}, ${segment.y}`].classList.add("fill");
    }
)
}

// inervalId=setInterval(()=>{
//     render();
// }, 400);

startButton.addEventListener("click", () => {
    modal.style.display = 'none';

    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
        render();
    }, 300);
   timerId = setInterval(() => {
        let [minutes, seconds] = time.split(':').map(Number);
        if (seconds < 59) {
            seconds++;
        } else {
            seconds = 0;
            minutes++;
        }
        time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeElement.innerText = time;
    }, 1000);
});

restartButton.addEventListener("click", restartGame);

function restartGame() {

    blocks[`${food.x}, ${food.y}`].classList.remove('food');
    snake.forEach((segment)=>{
        blocks[`${segment.x}, ${segment.y}`].classList.remove("fill");
    });

    score = 0;
    time = '00:00';
    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.textContent = highscore;
    direction = 'down';
    modal.style.display = 'none';
    snake = [{ x: 1, y: 3 }];
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
    intervalId = setInterval(() => {
        render();
    }, 400);

}

addEventListener('keydown', (event)=>{
    if(event.key==='ArrowLeft'){
        direction='left';
    } else if(event.key==='ArrowRight'){
        direction='right';
    } else if(event.key==='ArrowUp'){
        direction='up';
    } else if(event.key==='ArrowDown'){
        direction='down';
    }
})