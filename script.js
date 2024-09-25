const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;  
canvas.height = innerHeight;   
const maxVelocity = 7;
let gameState = true ;


class Bird{
    constructor(x,y){
        this.x  = x;
        this.y = y ;
        this.radius = 30 ;
        this.velocity = 0 ;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x , this.y ,this.radius ,0,Math.PI *2 ,false);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();         
    }
}

const bird = new Bird(100,100);
window.requestAnimationFrame(animate);


function animate(){
    clearCanvas();
    bird.draw();
    bird.velocity += 0.55;
    bird.velocity = Math.min(maxVelocity , bird.velocity)
    bird.y += bird.velocity;
    if(gameState){
        window.requestAnimationFrame(animate);
    }
}
function clearCanvas(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
}
window.addEventListener("keypress" , (e)=>{
    if(e.key === 'Enter'){
        gameState = false ;
    }
    if(e.key === "w"){
        bird.velocity = -10 ;
    }
})