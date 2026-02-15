let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  mouseX = 0;
  mouseY = 0;
  velocityX = 0;
  velocityY = 0;
  currentPaperX = 0;
  currentPaperY = 0;
  rotation = 0;

  init(paper) {
    // 1. Get initial rotation from CSS so it doesn't snap to 0
    const computedStyle = window.getComputedStyle(paper);
    const matrix = new DOMMatrixReadOnly(computedStyle.transform);
    this.rotation = Math.round(Math.atan2(matrix.b, matrix.a) * (180/Math.PI));

    // --- MOUSE MOVE ---
    document.addEventListener('mousemove', (e) => {
      if(!this.holdingPaper) return;
      
      this.velocityX = e.clientX - this.prevMouseX;
      this.velocityY = e.clientY - this.prevMouseY;
      
      this.currentPaperX += this.velocityX;
      this.currentPaperY += this.velocityY;
      
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    });

    // --- MOUSE DOWN ---
    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      if(e.button === 0) {
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      }
    });

    // --- MOUSE UP ---
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
    });

    // --- TOUCH START (Mobile) ---
    paper.addEventListener('touchstart', (e) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevMouseX = this.touchStartX;
      this.prevMouseY = this.touchStartY;
    }, {passive: false});

    // --- TOUCH MOVE (Mobile) ---
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault(); // Stop screen scrolling
      
      this.touchMoveX = e.touches[0].clientX;
      this.touchMoveY = e.touches[0].clientY;
      
      this.velocityX = this.touchMoveX - this.prevMouseX;
      this.velocityY = this.touchMoveY - this.prevMouseY;
      
      this.currentPaperX += this.velocityX;
      this.currentPaperY += this.velocityY;
      
      this.prevMouseX = this.touchMoveX;
      this.prevMouseY = this.touchMoveY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }, {passive: false});

    // --- TOUCH END ---
    window.addEventListener('touchend', () => {
      this.holdingPaper = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});