// board naam ka variable banaya hai
// Isme game ka canvas store hoga jahan poori game draw hogi
let board;

// context canvas ke andar drawing karne ke kaam aata hai
// Iski help se shapes, images aur game characters draw karte hain
let context;


// Game board me total kitni rows hongi
// Yaani upar se neeche tak 21 blocks
const rowCount = 21;

// Game board me total kitne columns honge
// Yaani left se right tak 19 blocks
const columnCount = 19;


// Har ek block/tile ka size 32 pixels hoga
// Pacman, walls aur ghosts isi size ke according set honge
const tileSize = 32;


// Poore board ki width calculate kar rahe hain
// columns × ek tile ka size
const boardWidth = columnCount * tileSize;


// Poore board ki height calculate kar rahe hain
// rows × ek tile ka size
const boardHeight = rowCount * tileSize;


// Wall ki image store karne ke liye variable
// Isme wall ka photo load hoga
let wallImage;


// Alag alag ghosts ki images store karne ke variables

// Blue ghost ki image
let blueGhostImage;

// Orange ghost ki image
let orangeGhostImage;

// Pink ghost ki image
let pinkGhostImage;

// Red ghost ki image
let redGhostImage;


// Pacman kis direction me face kar raha hai
// us direction ki image yahan store hogi


// Jab Pacman upar move karega
let pacmanUpImage;


// Jab Pacman neeche move karega
let pacmanDownImage;


// Jab Pacman left move karega
let pacmanLeftImage;


// Jab Pacman right move karega
let pacmanRightImage;

// Ye game ka poora map hai
// Har ek string ek row ko represent karti hai
// Har character ka alag meaning hai

const tileMap = [

    // X = wall
    // Space = khaali jagah jahan Pacman move kar sakta hai

    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",

    // O side tunnel ya empty border area ke liye use ho raha hai
    "OOOX X       X XOOO",

    // r = red ghost ki starting position
    "XXXX X XXrXX X XXXX",

    // b = blue ghost
    // p = pink ghost
    // o = orange ghost
    "O       bpo       O",

    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",

    // P = Pacman ki starting position
    "X  X     P     X  X",

    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX"

];


// walls naam ka Set banaya hai
// Isme game ki saari walls store hongi
const walls = new Set();


// foods naam ka Set
// Isme Pacman ke khane wale food dots store honge
const foods = new Set();


// ghosts naam ka Set
// Isme saare ghost objects store honge
const ghosts = new Set();


// Pacman object ko store karne ke liye variable
let pacman;


// Ye possible directions hain
// U = Up
// D = Down
// L = Left
// R = Right
const directions = ['U', 'D', 'L', 'R'];


// Player ka score store karega
let score = 0;


// Player ke total lives
// 3 baar ghost touch hone par game khatam
let lives = 3;


// Check karega game over hua ya nahi
// false matlab game abhi chal rahi hai
let gameOver = false;



// Ye function tab chalega jab poori website load ho jayegi
window.onload = function () {

    // HTML se canvas element ko pakad rahe hain
    board = document.getElementById("board");


    // Canvas ki width set kar rahe hain
    board.width = boardWidth;


    // Canvas ki height set kar rahe hain
    board.height = boardHeight;


    // Drawing context le rahe hain
    // Iski help se images aur shapes draw karenge
    context = board.getContext("2d");


    // Saari images load karo
    loadImages();


    // Game map load karo
    loadMap();


    // Har ghost ko random direction do
    for (let ghost of ghosts.values()) {

        // Random direction choose kar rahe hain
        const randomDirection =
            directions[Math.floor(Math.random() * 4)];

        // Ghost ki direction update karo
        ghost.updateDirection(randomDirection);
    }


    // Game ko continuously update/start karo
    update();


    // Keyboard key press detect karo
    // Jab user key chhodega tab movePacman function chalega
    document.addEventListener("keyup", movePacman);
};




// Ye function game ki saari images load karta hai
function loadImages() {

    // Wall image object bana rahe hain
    wallImage = new Image();


    // Ghost images bana rahe hain
    blueGhostImage = new Image();
    orangeGhostImage = new Image();
    pinkGhostImage = new Image();
    redGhostImage = new Image();


    // Pacman ki different direction images
    pacmanUpImage = new Image();
    pacmanDownImage = new Image();
    pacmanLeftImage = new Image();
    pacmanRightImage = new Image();


    // Ab image files ka path de rahe hain


    // Wall image load karo
    wallImage.src = "./images/wall.png";


    // Agar blue ghost image nahi ho to temporary red ghost use hoga
    blueGhostImage.src = "./images/redGhost.png";


    // Baaki ghosts ki images
    orangeGhostImage.src = "./images/orangeGhost.png";
    pinkGhostImage.src = "./images/pinkGhost.png";
    redGhostImage.src = "./images/redGhost.png";


    // Pacman ki movement images
    pacmanUpImage.src = "./images/pacmanUp.png";
    pacmanDownImage.src = "./images/pacmanDown.png";
    pacmanLeftImage.src = "./images/pacmanLeft.png";
    pacmanRightImage.src = "./images/pacmanRight.png";
}

// Ye function poora map load karta hai
// Matlab walls, ghosts, foods aur Pacman ko board par place karta hai

function loadMap() {

    // Purani walls hata do
    walls.clear();

    // Purana food hata do
    foods.clear();

    // Purane ghosts hata do
    ghosts.clear();


    // Har row ko check karo
    for (let r = 0; r < rowCount; r++) {

        // Har column ko check karo
        for (let c = 0; c < columnCount; c++) {

            // Current row nikalo
            const row = tileMap[r];

            // Current character nikalo
            // Jaise X, P, b, o etc.
            const tileMapChar = row[c];


            // X position calculate karo
            const x = c * tileSize;

            // Y position calculate karo
            const y = r * tileSize;


            // Agar character X hai to wall banao
            if (tileMapChar == 'X') {

                // New wall object create karo
                const wall =
                    new Block(
                        wallImage, // wall ki image
                        x,         // x position
                        y,         // y position
                        tileSize,  // width
                        tileSize   // height
                    );

                // Wall ko walls set me add karo
                walls.add(wall);
            }


            // Agar b mila to blue ghost banao
            else if (tileMapChar == 'b') {

                const ghost =
                    new Block(
                        blueGhostImage,
                        x,
                        y,
                        tileSize,
                        tileSize
                    );

                // Ghost ko ghosts set me add karo
                ghosts.add(ghost);
            }


            // Agar o mila to orange ghost banao
            else if (tileMapChar == 'o') {

                const ghost =
                    new Block(
                        orangeGhostImage,
                        x,
                        y,
                        tileSize,
                        tileSize
                    );

                ghosts.add(ghost);
            }


            // Agar p mila to pink ghost banao
            else if (tileMapChar == 'p') {

                const ghost =
                    new Block(
                        pinkGhostImage,
                        x,
                        y,
                        tileSize,
                        tileSize
                    );

                ghosts.add(ghost);
            }


            // Agar r mila to red ghost banao
            else if (tileMapChar == 'r') {

                const ghost =
                    new Block(
                        redGhostImage,
                        x,
                        y,
                        tileSize,
                        tileSize
                    );

                ghosts.add(ghost);
            }


            // Agar P mila to Pacman banao
            else if (tileMapChar == 'P') {

                pacman =
                    new Block(
                        pacmanRightImage, // starting me right face karega
                        x,
                        y,
                        tileSize,
                        tileSize
                    );
            }


            // Agar khaali space mila to food dot banao
            else if (tileMapChar == ' ') {

                const food =
                    new Block(
                        null,   // food ki image nahi hai
                        x + 14, // center me lane ke liye thoda shift
                        y + 14,
                        4,      // food ki width
                        4       // food ki height
                    );

                // Food ko foods set me add karo
                foods.add(food);
            }
        }
    }
}



// Ye main game loop hai
// Is function ki wajah se game continuously chalti rehti hai

function update() {

    // Agar game over ho gayi hai to function yahin stop
    if (gameOver) {
        return;
    }


    // Sab objects ko move karo
    move();


    // Sab objects ko screen par draw karo
    draw();


    // 50 milliseconds baad update function dobara chalao
    // Isse game repeatedly chalti rehti hai
    setTimeout(update, 50);
}
// Ye function screen par saari cheezein draw karta hai
// Jaise background, walls, food, ghosts aur Pacman

function draw() {

    // Purani drawing ko clear karo
    context.clearRect(0, 0, board.width, board.height);


    // Background black color ka banao
    context.fillStyle = "black";

    // Poore board ko black color se fill karo
    context.fillRect(0, 0, board.width, board.height);


    // Walls ka color blue set karo
    context.fillStyle = "blue";


    // Saari walls ko draw karo
    for (let wall of walls.values()) {

        context.fillRect(
            wall.x,      // x position
            wall.y,      // y position
            wall.width,  // width
            wall.height  // height
        );
    }


    // Food dots ka color white
    context.fillStyle = "white";


    // Saare foods draw karo
    for (let food of foods.values()) {

        context.fillRect(
            food.x,
            food.y,
            food.width,
            food.height
        );
    }


    // Saare ghosts draw karo
    for (let ghost of ghosts.values()) {

        context.drawImage(
            ghost.image,   // ghost ki image
            ghost.x,
            ghost.y,
            ghost.width,
            ghost.height
        );
    }


    // Pacman ko draw karo
    context.drawImage(
        pacman.image,
        pacman.x,
        pacman.y,
        pacman.width,
        pacman.height
    );


    // Score aur lives ka text white color me
    context.fillStyle = "white";

    // Text ka font size
    context.font = "18px sans-serif";


    // Agar game over ho gayi
    if (gameOver) {

        // Game over text show karo
        context.fillText(
            "Game Over : " + score,
            20,
            20
        );
    }

    // Agar game chal rahi hai
    else {

        // Lives aur score show karo
        context.fillText(
            "Lives : " + lives + "   Score : " + score,
            20,
            20
        );
    }
}




// Ye function game ke saare movements handle karta hai

function move() {

    // Pacman ko move karo
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;


    // Check karo Pacman wall se takraya ya nahi
    for (let wall of walls.values()) {

        if (collision(pacman, wall)) {

            // Agar takra gaya to wapas previous position par bhejo
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;

            break;
        }
    }


    // Ghost collision check karo
    for (let ghost of ghosts.values()) {

        // Agar ghost ne Pacman ko touch kiya
        if (collision(ghost, pacman)) {

            // Ek life kam karo
            lives--;


            // Agar saari lives khatam
            if (lives == 0) {

                // Game over
                gameOver = true;
                return;
            }

            // Positions reset karo
            resetPositions();
        }


        // Ghost ko move karo
        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;


        // Ghost wall se takraya ya nahi
        for (let wall of walls.values()) {

            if (
                collision(ghost, wall) ||
                ghost.x <= 0 ||
                ghost.x + ghost.width >= boardWidth
            ) {

                // Takrane par ghost ko peeche lao
                ghost.x -= ghost.velocityX;
                ghost.y -= ghost.velocityY;


                // Random new direction do
                const newDirection =
                    directions[Math.floor(Math.random() * 4)];

                ghost.updateDirection(newDirection);
            }
        }
    }


    // Food collision check
    let foodEaten = null;


    // Saare food dots check karo
    for (let food of foods.values()) {

        // Agar Pacman ne food kha liya
        if (collision(pacman, food)) {

            foodEaten = food;

            // Score increase karo
            score += 10;

            break;
        }
    }


    // Food delete karo
    if (foodEaten) {
        foods.delete(foodEaten);
    }


    // Agar saara food khatam
    if (foods.size == 0) {

        // Naya level load karo
        loadMap();

        // Positions reset karo
        resetPositions();
    }
}




// Keyboard se Pacman movement control hota hai

function movePacman(e) {

    // Agar game over hai
    if (gameOver) {

        // Game restart karo
        loadMap();

        resetPositions();

        lives = 3;
        score = 0;
        gameOver = false;

        update();

        return;
    }


    // UP movement
    if (e.code == "ArrowUp" || e.code == "KeyW") {

        pacman.updateDirection('U');
    }


    // DOWN movement
    else if (e.code == "ArrowDown" || e.code == "KeyS") {

        pacman.updateDirection('D');
    }


    // LEFT movement
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {

        pacman.updateDirection('L');
    }


    // RIGHT movement
    else if (e.code == "ArrowRight" || e.code == "KeyD") {

        pacman.updateDirection('R');
    }


    // Direction ke according image change karo

    if (pacman.direction == 'U') {
        pacman.image = pacmanUpImage;
    }

    else if (pacman.direction == 'D') {
        pacman.image = pacmanDownImage;
    }

    else if (pacman.direction == 'L') {
        pacman.image = pacmanLeftImage;
    }

    else if (pacman.direction == 'R') {
        pacman.image = pacmanRightImage;
    }
}




// Ye function check karta hai ki
// do objects ek dusre se takra rahe hain ya nahi

function collision(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}




// Ye function Pacman aur ghosts ko
// unki starting position par wapas bhejta hai

function resetPositions() {

    // Pacman reset
    pacman.reset();

    // Pacman movement stop
    pacman.velocityX = 0;
    pacman.velocityY = 0;


    // Saare ghosts reset
    for (let ghost of ghosts.values()) {

        ghost.reset();


        // Ghost ko random direction do
        const newDirection =
            directions[Math.floor(Math.random() * 4)];

        ghost.updateDirection(newDirection);
    }
}




// Ye Block class hai
// Isse walls, ghosts, Pacman aur foods banaye jaate hain

class Block {

    constructor(image, x, y, width, height) {

        // Object ki image
        this.image = image;


        // Position
        this.x = x;
        this.y = y;


        // Size
        this.width = width;
        this.height = height;


        // Starting position save karo
        this.startX = x;
        this.startY = y;


        // Default direction right
        this.direction = 'R';


        // Speed
        this.velocityX = 0;
        this.velocityY = 0;
    }


    // Direction update karne wala function
    updateDirection(direction) {

        // Purani direction save karo
        const previousDirection = this.direction;


        // Nayi direction set karo
        this.direction = direction;


        // Velocity update karo
        this.updateVelocity();


        // Thoda move karke check karo
        this.x += this.velocityX;
        this.y += this.velocityY;


        // Wall collision check karo
        for (let wall of walls.values()) {

            if (collision(this, wall)) {

                // Agar wall se takra gaya to wapas lao
                this.x -= this.velocityX;
                this.y -= this.velocityY;


                // Purani direction wapas set karo
                this.direction = previousDirection;

                this.updateVelocity();

                return;
            }
        }
    }


    // Direction ke according speed set hoti hai
    updateVelocity() {

        // UP
        if (this.direction == 'U') {

            this.velocityX = 0;
            this.velocityY = -tileSize / 4;
        }


        // DOWN
        else if (this.direction == 'D') {

            this.velocityX = 0;
            this.velocityY = tileSize / 4;
        }


        // LEFT
        else if (this.direction == 'L') {

            this.velocityX = -tileSize / 4;
            this.velocityY = 0;
        }


        // RIGHT
        else if (this.direction == 'R') {

            this.velocityX = tileSize / 4;
            this.velocityY = 0;
        }
    }


    // Object ko starting position par bhejo
    reset() {

        this.x = this.startX;
        this.y = this.startY;
    }
}


