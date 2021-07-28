var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var coinGroup, coinImage;
var obstaclesGroup, obstacle2, obstacle1, obstacle3;
var score = 0;
var life = 3;

var  restart;

localStorage["HighestScore"] = 0;

function preload() {
  mario_running = loadAnimation("Capture1.png", "Capture3.png", "Capture4.png");
  mario_collided = loadAnimation("mariodead.png");
  groundImage = loadImage("brickwall.png");
  coinSound = loadSound("coin.wav");

  coinImage = loadImage("coin.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle3 = loadImage("obstacle3.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  mario = createSprite(50, 180, 20, 50);
  mario.addAnimation("running", mario_running);
  mario.scale = 0.5;

  ground = createSprite(0, 190, 1200, 10);
  ground.x = ground.width / 2;
  ground.velocityX = -(6 + 3 * score / 100)
  ground.addImage(groundImage)
  ground.scale=1
    
  restart = createSprite(300, 140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;

  coinGroup = new Group();
  obstaclesGroup = new Group();
  score = 0;
}

function draw() {
  background("lightgreen");
  textSize(20);
  fill(255);
  text("Score: " + score, 500, 40);
  text("Life: " + life, 500, 60);
  drawSprites();
  if (gameState === PLAY) {

    if (score >= 0) {
      ground.velocityX = -2;
    } else {
      ground.velocityX = -(6 + 3 * score / 100);
    }

    if (keyDown("space") && mario.y >= 139) {
      mario.velocityY = -15;
    }

    mario.velocityY = mario.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    mario.collide(ground);

    spawnCoin();
    spawnObstacles();

    if (obstaclesGroup.isTouching(mario)) {
      life = life - 1;
      gameState = END;
      
    }
    if (coinGroup.isTouching(mario)) {
      score = score + 1;
      coinSound.play();
      
     coinGroup[0].destroy();
      
    }
  } else if (gameState === END) {
    restart.visible = true;
     text("restart", 280,170 );
    mario.addAnimation("collided", mario_collided);


    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);

    mario.changeAnimation("collided", mario_collided);
    mario.scale = 0.35;

    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      if (life > 0) {
        reset();
      }

    }
  }
}

function spawnCoin() {
  if (frameCount % 60 === 0) {
    var coin = createSprite(600, 120, 40, 10);
    coin.y = Math.round(random(80, 120));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;

    coin.lifetime = 200;

    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;

    coinGroup.add(coin);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 108, 10, 40);
    //generate random obstacles
    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle2);
        break;
      case 2:
        obstacle.addImage(obstacle1);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
    }

    obstacle.velocityX = -(6 + 3 * score / 100);

    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function reset() {

  gameState = PLAY;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();

  mario.changeAnimation("running", mario_running);
  mario.scale = 0.5;

  if (localStorage["HighestScore"] < score) {
    localStorage["HighestScore"] = score;
  }

  score = 0;
 
}
