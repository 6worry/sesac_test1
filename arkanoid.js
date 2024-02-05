const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const ballRadius = 10;

// 공의 시작 위치
let x = canvas.width / 2;
let y = canvas.height - 30;

// 공의 속도
let dx = 2;
let dy = 2;

// 패들 정의
const paddleHeight = 10;
const paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 4;

// 키 입출력 제어
let rightPressed = false;
let leftPressed = false;

// 브릭 정의
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let brickCount = brickRowCount * brickColumnCount;

// 브릭 충돌감지
const bricks =[];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    };
};


function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {

                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = '#FF00FF';
                context.fill();
                context.closePath();
            };
        };
    };
};

function drawBall() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = '#FF00FF';
    context.fill();
    context.closePath();
};

function drawPaddle() {

    // 네모박스 패들 그리기
    context.beginPath();
    context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = '#F0F';
    context.fill();
    context.closePath();
};

function gameOver() {
    context.fillStyle = '#FOF';
    context.font = '30px Arial';
    context.fillText('게임오버', canvas.width / 2 - 80, canvas.height / 2);
};

function gameClear() {
    context.fillStyle = '#FOF';
    context.font = '30px Arial';
    context.fillText('게임 클리어', canvas.width / 2 - 80, canvas.height / 2);
};

function moveBall() {

    //좌표값 변경
    x += dx;
    y += dy;

    // 화면의 바운더리를 살짝 벗어나는 문제 해결
    if (x > canvas.width - ballRadius || x < ballRadius) {
        dx = -dx;
    };
    
    // 천장에 닿았을 때 아래로 이동
    if (y < ballRadius) {
        dy = -dy;
    } else if (y > canvas.height - ballRadius) { // 패들에 닿았을 때 위로 이동
        if (x > paddleX && x < paddleX + paddleWidth) {
            if ((y > canvas.height - paddleHeight) && (y < canvas.height)) {
                dy = -dy;
            };
        } else {
            gameOver(); 
            return;
        };
    };
};

function movePaddle() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    };
};

function collectionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            // 여기에 충돌로직 구현
            // x, y = 공의 위치, b.x, b.y = 브릭위치
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth &&
                    y > b.y && y < b.y + brickHeight  
                ) {  
                    b.status = 0;
                    dy = -dy;
                    brickCount -= 1
                    if (brickCount === 0) {
                        gameClear();
                        return;
                    };
                };
            };
        };
    };
};

function draw() {
    // 화면 클리어
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawBricks();

    moveBall();
    movePaddle();

    collectionDetection();

    requestAnimationFrame(draw);
};

// 키보드 입출력 정의
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) { // 키를 눌렀을 때 호출
    if (e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'ArrowLeft') {
        leftPressed = true;
    };
};

function keyUpHandler(e) { // 키를 뗐을 때 호출
    if (e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// 메인 함수 호출
draw();