<script>
  // Draw ball
  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
  }

  // Draw paddle
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
  }

  // Draw bricks
  function drawBricks() {
    for (let i = 0; i < brick.rows; i++) {
      for (let j = 0; j < brick.cols; j++) {
        if (bricks[i][j].status === 1) {
          const brickX = j * (brick.width + brick.padding) + brick.offsetX;
          const brickY = i * (brick.height + brick.padding) + brick.offsetY;
          bricks[i][j].x = brickX;
          bricks[i][j].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brick.width, brick.height);
          ctx.fillStyle = '#fff';
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  // Ball collision detection
  function collisionDetection() {
    for (let i = 0; i < brick.rows; i++) {
      for (let j = 0; j < brick.cols; j++) {
        const b = bricks[i][j];
        if (b.status === 1 && ball.x > b.x && ball.x < b.x + brick.width && ball.y > b.y && ball.y < b.y + brick.height) {
          ball.dy = -ball.dy;
          b.status = 0;
        }
      }
    }
  }

  // Move ball
  function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) ball.dx = -ball.dx;
    if (ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;

    // Paddle collision
    if (ball.y + ball.dy > canvas.height - ball.radius) {
      if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) ball.dy = -ball.dy;
      else gameOver();
    }
  }

  // Game over
  function gameOver() {
    alert('Game Over!');
    document.location.reload();
  }

  // Paddle movement
  document.addEventListener('touchmove', (e) => {
    const touchX = e.touches[0].clientX;
    paddle.x = touchX - paddle.width / 2;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
  });

  // Render game
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    moveBall();
    collisionDetection();
    requestAnimationFrame(draw);
  }

  draw();
  
  let score = 0;

  // Update score
  function updateScore() {
    score++;
    if (score === brick.rows * brick.cols) {
      alert('You Win!');
      document.location.reload();
    }
  }

  // Modify collision detection to update score
  function collisionDetection() {
    for (let i = 0; i < brick.rows; i++) {
      for (let j = 0; j < brick.cols; j++) {
        const b = bricks[i][j];
        if (b.status === 1 && ball.x > b.x && ball.x < b.x + brick.width && ball.y > b.y && ball.y < b.y + brick.height) {
          ball.dy = -ball.dy;
          b.status = 0;
          updateScore();
        }
      }
    }
  }

  // Ensure canvas resizes on window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
</script>