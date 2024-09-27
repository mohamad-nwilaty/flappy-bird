const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;  
canvas.height = innerHeight;   
const maxVelocity = 7;
let gameState = true ;
let score = 0 ;
let bestScore = localStorage.getItem("bestscore")||0 ;
let audio = new Audio("./sfx_point.mp3");
let specialAudio = new Audio("./yipee.mp3");
//bird image
let birdImage = new Image();
birdImage.src = "./flappybird.png" ;
// pipe image
let topPipe = new Image();
topPipe.src = "./toppipe.png";
let bottomPipe = new Image();
bottomPipe.src = "./bottompipe.png";
const pipeHeight = 530 ;
const pipeWidth = 65;
//background image
const background = new Image();
background.src = "./flappy-bird-background.jpg";


let pipes = [];

class Bird{
    constructor(x,y){
        this.x  = x;
        this.y = y ;
        this.radius = 30 ;
        this.velocity = 0 ;
        this.width = 50; // for the image
        this.height = 35;
    }
    draw(){
        ctx.beginPath();
        ctx.drawImage(birdImage , this.x , this.y , this.width , this.height)
        ctx.closePath();         
    }
}
class Pipe {
    constructor(x) {
        this.x = x;
        this.gap = 170; // Gap size between the top and bottom pipe
        this.gapY = Math.floor(Math.random()*( 0.33 * innerHeight) + 0.33 * innerHeight ) // Random Y position for the gap
        this.scored = false ;
    }
    draw() {
        ctx.beginPath();
        // Draw the top pipe
        ctx.drawImage(topPipe, this.x, this.gapY - pipeHeight, pipeWidth, pipeHeight );
        // Draw the bottom pipe
        ctx.drawImage(bottomPipe, this.x, this.gapY + this.gap, pipeWidth, pipeHeight + this.gap);
        ctx.closePath();         
    }
}

const bird = new Bird(100,100);
let p = new Pipe(200) ;
setInterval(()=>{
    createPipe();
},2000)
deathScreen() // this is a bug that i couldnt fix the first time I call the death screen function it doesnt use the correct font I tried everything and it didnt work even chat gpt gave up so I just call it at the start once and it works fine after
window.requestAnimationFrame(animate);

function animate(){
    clearCanvas();
    

    drawBackground();
    // draw and move bird
    bird.draw();
    bird.velocity += 0.55;
    bird.velocity = Math.min(maxVelocity , bird.velocity)
    bird.y += bird.velocity;
    // deraw and move pipes
    for(let i=0 ; i<pipes.length ; i++){
        pipes[i].x -=2 ;
        pipes[i].draw();

        if(checkCollision(pipes[i])){
            gameState = false
        }

        if(pipes[i].x < - pipeWidth){
            pipes.splice(i , 1);
            i -- ;
        }
    }
    
    drawScore()
    
    if (!gameState) {  
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem("bestscore", bestScore);
        }
        deathScreen();
    }
    
        

    if(gameState){
        requestAnimationFrame(animate);
    }
}
function clearCanvas(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
}

function createPipe(){
    let p = new Pipe(innerWidth);
    pipes.push(p);
}
function checkCollision(pipe){
    if(bird.x + bird.width > pipe.x  && bird.x < pipe.x + pipeWidth ){
        if(bird.x  > pipe.x  && !pipe.scored){ //increment the score
            score ++ ;
            if(score % 10 === 0){
                specialAudio.play()
            }
            else{
                audio.play()
            }
            pipe.scored = true
        }
        if(bird.y < pipe.gapY || bird.y + bird.height > pipe.gapY+ pipe.gap){
            return true ;
        }
    }
    if(bird.y +bird.height > innerHeight){
        return true ;
    }
    return false
}
function drawBackground(){
    ctx.drawImage(background ,0,0,canvas.width,canvas.height)
}
function drawScore(){
    ctx.font = "24px flappy-font1";
    ctx.fillText(`${score}`,10,25);
}
function resetGame(){
    gameState = true;
    pipes = [];
    bird.y = 200;
    score = 0
    requestAnimationFrame(animate);
}

function deathScreen() {

        ctx.font = "70px flappy-font2";
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        console.log(ctx.font)
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 50);

        ctx.fillStyle = "black";
        ctx.fillText("Score: " , canvas.width / 2, canvas.height / 2);
        ctx.fillText("Best Score: " , canvas.width / 2, canvas.height / 2 + 50);
        ctx.font = "40px flappy-font1";
        ctx.fillText(score , canvas.width / 2 +80, canvas.height / 2 +5);
        ctx.fillText(bestScore , canvas.width / 2 +130, canvas.height / 2 +55);


    
}

window.addEventListener("keydown" , (e)=>{
    console.log(e.key)
    if(e.key === 'Enter'){
        gameState = false ;
    }
    if(e.key === "w" || e.key === " " ){
        console.log("yes")
        if(!gameState){
            resetGame()
        }
        bird.velocity = -10 ;
    }
})