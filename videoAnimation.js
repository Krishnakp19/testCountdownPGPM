(() => {
    const video = document.getElementById('cornerVideoContainer');
    
    // Video dimensions - PORTRAIT (taller than wide)
    const videoWidth = 120;
    const videoHeight = 180;
    
    // Get viewport dimensions
    function getViewportSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
    
    // DVD Logo style: Start from top-left corner (classic DVD screensaver start)
    let x = 0;
    let y = 0;
    
    // DVD Logo style: Diagonal movement (45 degree angle)
    const speed = 2;
    let velocityX = speed;  // Moving right
    let velocityY = speed;  // Moving down
    
    console.log(`🎬 DVD Logo: Starting at corner (0, 0) with diagonal movement`);
    
    // Color change on corner hit (optional visual feedback)
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    let currentColorIndex = 0;
    
    function changeColor() {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        video.style.background = `${colors[currentColorIndex]}33`; // 33 = 20% opacity
    }
    
    // Check if hit corner (both edges at the same time)
    function checkCornerHit(prevX, prevY, newX, newY) {
        const viewport = getViewportSize();
        
        // Check if both X and Y direction changed (corner hit)
        const hitLeftOrRight = (newX <= 0 || newX + videoWidth >= viewport.width) && 
                               (prevX !== newX);
        const hitTopOrBottom = (newY <= 0 || newY + videoHeight >= viewport.height) && 
                               (prevY !== newY);
        
        if (hitLeftOrRight && hitTopOrBottom) {
            console.log('🎯 CORNER HIT! Position:', Math.floor(newX), Math.floor(newY));
            changeColor();
            // Optional: Trigger confetti or celebration
            if (window.confetti) {
                confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { 
                        x: (newX + videoWidth / 2) / viewport.width, 
                        y: (newY + videoHeight / 2) / viewport.height 
                    }
                });
            }
        }
    }
    
    // Animation frame rate
    const FPS = 60;
    
    // Update position
    function animate() {
        const viewport = getViewportSize();
        
        // Store previous position for corner detection
        const prevX = x;
        const prevY = y;
        
        // Update position
        x += velocityX;
        y += velocityY;
        
        // Check for collision with edges and reverse direction (DVD Logo style)
        if (x + videoWidth >= viewport.width || x <= 0) {
            velocityX = -velocityX;
            // Clamp position to prevent getting stuck
            x = x <= 0 ? 0 : viewport.width - videoWidth;
        }
        
        if (y + videoHeight >= viewport.height || y <= 0) {
            velocityY = -velocityY;
            // Clamp position to prevent getting stuck
            y = y <= 0 ? 0 : viewport.height - videoHeight;
        }
        
        // Check for corner hit (after bounce)
        checkCornerHit(prevX, prevY, x, y);
        
        // Apply new position
        video.style.left = x + 'px';
        video.style.top = y + 'px';
    }
    
    // Start animation
    setInterval(animate, 1000 / FPS);
    
    // Update on window resize
    window.addEventListener('resize', () => {
        const viewport = getViewportSize();
        // Keep video within bounds after resize
        if (x + videoWidth > viewport.width) {
            x = viewport.width - videoWidth;
            velocityX = -Math.abs(velocityX); // Bounce back left
        }
        if (y + videoHeight > viewport.height) {
            y = viewport.height - videoHeight;
            velocityY = -Math.abs(velocityY); // Bounce back up
        }
        if (x < 0) {
            x = 0;
            velocityX = Math.abs(velocityX); // Bounce back right
        }
        if (y < 0) {
            y = 0;
            velocityY = Math.abs(velocityY); // Bounce back down
        }
    });
})();
