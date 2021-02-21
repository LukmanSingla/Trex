var trex,trex_running,edges,ground,groundMoving,score,highScore,invisible_ground,trex_jump,cload,cloud_load,obstacle,ob1,ob2,ob3,ob4,ob5,ob6,obstacleGroup,cloudGroup,trex_collide,gameOver,GOimg,frameRandom,restart,restart_load,jumpSound,checkPoint,die,CP=100,rate=0.3;
const PLAY=1;
const END=0;
var gameState = PLAY;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png", "trex4.png" );
  groundMoving= loadImage("ground2.png");
  trex_jump=loadAnimation("trex1.png");
  cloud_load=loadImage("cloud.png");
  ob1=loadImage("obstacle1.png");
  ob2=loadImage("obstacle2.png");
  ob3=loadImage("obstacle3.png");
  ob4=loadImage("obstacle4.png");
  ob5=loadImage("obstacle5.png");
  ob6=loadImage("obstacle6.png");
  trex_collide=loadImage("trex_collided.png");
  GOimg=loadImage("gameOver.png");
  restart_load=loadImage("restart.png");
  jumpSound=loadSound("jump.mp3");
  die=loadSound("die.mp3");
  checkPoint=loadSound("checkPoint.mp3");
}

function setup(){
  createCanvas(600,200);
  score=0;
  highScore=0;
  
  gameOver=createSprite(300,100,50,50);
  gameOver.addImage("gameOver",GOimg);
  gameOver.scale=0.5;
  
  ground=createSprite(300,180,600,20);
  ground.addImage("ground_moving",groundMoving);
    
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("jump",trex_jump);
  trex.addAnimation("trex_collide",trex_collide);
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,40);
  // trex.debug=true;
  restart=createSprite(300,130,100,100);
  restart.addImage("restart",restart_load);
  restart.scale=0.5;
  invisible_ground=createSprite(300,190,600,10);
  invisible_ground.visible=false;
  
  edges = createEdgeSprites();
  obstacleGroup=new Group();
  cloudGroup= new Group();
  // console.warn("This is an warning");
  // console.error("This is an error");
  // console.info("this is an information");
  
}

function draw(){
  // console.time();
  // console.count();

  background("white");
  if(gameState==PLAY){
     score=score+rate;
     gameOver.visible=false;
     if(keyDown("up")  && trex.y>=161 ){
       trex.velocityY = -14;
       trex.changeAnimation("jump",trex_jump);
       jumpSound.play();
     } 
     restart.visible=false;
     trex.velocityY=trex.velocityY + 1;
    
     if(trex.y>=160 && trex.velocityY==1){
       trex.changeAnimation("running",trex_running);
     }
     if(score>CP){
       CP=CP+100;
       checkPoint.play();
       rate=rate+0.1;
     }
    
     spawnCloud();
     spawnObstacle();
     
     ground.velocityX=-10;
     if(ground.x<0){
      ground.x=ground.width / 2;
     }
    
    if(trex.isTouching(obstacleGroup)){
      gameState=END;
      trex.velocityY=0;
      trex.velocityX=0;
      die.play();
    }
  }
  else if(gameState==END){
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
   if(score>=highScore){
    highScore=score;
   }
    restart.visible=true;
    obstacleGroup.setVelocityXEach(0);
    ground.velocityX=0;
    cloudGroup.setVelocityXEach(0);              
    trex.changeAnimation("trex_collide",trex_collide);
    gameOver.visible=true;
    if(mousePressedOver(restart)){
      gameState=PLAY;
      obstacleGroup.destroyEach();
      cloudGroup.destroyEach();
      score=0;
      rate=0.3;
    }
  }
    
  text(mouseX+","+mouseY,mouseX, mouseY);
  text("HI " + Math.floor(highScore) + "  "+Math.floor(score),530,60);
  trex.collide(invisible_ground);
  drawSprites();
}


function spawnCloud(){
 
  if(frameCount%frameRandom==0 || frameCount==15){
  cloud=createSprite(600,50,50,50);
  frameRandom=Math.round(random(40,240));
  cloud.addImage("cloud",cloud_load);
  cloud.velocityX=-2;
  cloud.scale=0.5;
  cloud.y=Math.round(random(30,100));
  // console.log(cloud.x);
  cloud.depth=trex.depth;
  trex.depth++;
  cloud.lifetime=600;  
  cloudGroup.add(cloud);
  }

}

function spawnObstacle(){
  
  if(frameCount%60==0){
    obstacle=createSprite(600,160,50,50);
    obstacle.velocityX=ground.velocityX;
    var rand=Math.round(random(1,7));
    // obstacle.debug=true;
    switch(rand){
      case 1:obstacle.addImage("obstacle1",ob1);obstacle.scale=0.7;
        break;
        case 2:obstacle.addImage("ob2",ob2);obstacle.scale=0.7;
        break;
        case 3:obstacle.addImage("ob3",ob3);obstacle.scale=0.7;
        break;
        case 4:obstacle.addImage("ob4",ob4);obstacle.scale=0.5;
        break;
        case 5:obstacle.addImage("ob5",ob5);obstacle.scale=0.5;
        break;
        case 6:obstacle.addImage("ob6",ob6);obstacle.scale=0.5;
        break;
        case 7:obstacle.destroy();
        break;
    }
    
    obstacle.lifetime=600;
    obstacleGroup.add(obstacle);
  }
    
}