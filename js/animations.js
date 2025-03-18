// Enhanced animations.js with more tech-focused effects

// Initialize cursor effects with digital elements
function initCursorEffects() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
  
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);
  
  // Add cursor trail effect
  const cursorTrail = document.createElement('div');
  cursorTrail.className = 'cursor-trail';
  document.body.appendChild(cursorTrail);
  
  const trailDots = [];
  const trailDotsCount = 10;
  
  for (let i = 0; i < trailDotsCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    dot.style.opacity = 1 - (i / trailDotsCount);
    dot.style.scale = 1 - (i / trailDotsCount) * 0.5;
    cursorTrail.appendChild(dot);
    trailDots.push({
      element: dot,
      x: 0,
      y: 0
    });
  }
  
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    gsap.to(cursor, {
      x: mouseX,
      y: mouseY,
      duration: 0.3
    });
    
    gsap.to(cursorDot, {
      x: mouseX,
      y: mouseY,
      duration: 0.1
    });
  });
  
  // Update trail dots position
  function updateTrail() {
    trailDots.forEach((dot, index) => {
      if (index === 0) {
        dot.x = mouseX;
        dot.y = mouseY;
      } else {
        dot.x += (trailDots[index - 1].x - dot.x) * 0.3;
        dot.y += (trailDots[index - 1].y - dot.y) * 0.3;
      }
      
      gsap.set(dot.element, {
        x: dot.x,
        y: dot.y
      });
    });
    
    requestAnimationFrame(updateTrail);
  }
  
  updateTrail();
  
  // Add hover effect for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-item');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      cursorTrail.classList.add('active');
      
      // Add ripple effect
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${mouseX}px`;
      ripple.style.top = `${mouseY}px`;
      document.body.appendChild(ripple);
      
      gsap.to(ripple, {
        scale: 3,
        opacity: 0,
        duration: 1,
        onComplete: () => {
          ripple.remove();
        }
      });
    });
    
    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      cursorTrail.classList.remove('active');
    });
  });
}

// Initialize text animations with digital effects
function initTextAnimations() {
  // Split text into characters for animation
  const animatedTexts = document.querySelectorAll('.animate-text');
  
  animatedTexts.forEach(text => {
    const content = text.textContent;
    text.textContent = '';
    
    for (let i = 0; i < content.length; i++) {
      const char = document.createElement('span');
      char.className = 'animated-char';
      char.textContent = content[i] === ' ' ? '\u00A0' : content[i];
      char.style.animationDelay = `${i * 0.05}s`;
      text.appendChild(char);
    }
  });
  
  // Add digital glitch effect to headings
  const headings = document.querySelectorAll('h1, h2, h3');
  
  headings.forEach(heading => {
    heading.addEventListener('mouseover', () => {
      heading.classList.add('glitch-hover');
      
      setTimeout(() => {
        heading.classList.remove('glitch-hover');
      }, 1000);
    });
  });
}

// Initialize hover effects with more tech-focused animations
function initHoverEffects() {
  // Skill items hover effect
  const skillItems = document.querySelectorAll('.skill-item');
  
  skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      gsap.to(item, {
        y: -10,
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 188, 212, 0.5)',
        borderColor: '#00bcd4',
        duration: 0.3
      });
      
      // Add digital circuit animation
      const circuit = document.createElement('div');
      circuit.className = 'digital-circuit';
      item.appendChild(circuit);
      
      for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line';
        line.style.top = `${Math.random() * 100}%`;
        line.style.left = `${Math.random() * 100}%`;
        line.style.width = `${Math.random() * 50 + 20}px`;
        line.style.transform = `rotate(${Math.random() * 360}deg)`;
        line.style.animationDelay = `${Math.random() * 0.5}s`;
        circuit.appendChild(line);
        
        const node = document.createElement('div');
        node.className = 'circuit-node';
        node.style.top = `${Math.random() * 100}%`;
        node.style.left = `${Math.random() * 100}%`;
        node.style.animationDelay = `${Math.random() * 0.5}s`;
        circuit.appendChild(node);
      }
    });
    
    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        y: 0,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
        duration: 0.3
      });
      
      const circuit = item.querySelector('.digital-circuit');
      if (circuit) {
        circuit.remove();
      }
    });
  });
  
  // Project cards hover effect with 3D tilt
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 188, 212, 0.3)',
        borderColor: '#00bcd4',
        duration: 0.3
      });
      
      gsap.to(card.querySelector('.project-overlay'), {
        opacity: 1,
        duration: 0.3
      });
      
      // Add data flow animation
      const dataFlow = document.createElement('div');
      dataFlow.className = 'data-flow';
      card.appendChild(dataFlow);
      
      for (let i = 0; i < 20; i++) {
        const dataBit = document.createElement('div');
        dataBit.className = 'data-bit';
        dataBit.style.top = `${Math.random() * 100}%`;
        dataBit.style.left = `-10px`;
        dataBit.style.animationDelay = `${Math.random() * 2}s`;
        dataFlow.appendChild(dataBit);
      }
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
        duration: 0.3
      });
      
      gsap.to(card.querySelector('.project-overlay'), {
        opacity: 0,
        duration: 0.3
      });
      
      const dataFlow = card.querySelector('.data-flow');
      if (dataFlow) {
        dataFlow.remove();
      }
    });
    
    // 3D tilt effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPercent = x / rect.width;
      const yPercent = y / rect.height;
      
      const rotateX = (0.5 - yPercent) * 10;
      const rotateY = (xPercent - 0.5) * 10;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.4
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.7
      });
    });
  });
  
  // Button hover effects with digital animation
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3
      });
      
      // Add digital particles
      for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'btn-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        button.appendChild(particle);
        
        gsap.to(particle, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          opacity: 0,
          duration: 1,
          onComplete: () => {
            particle.remove();
          }
        });
      }
    });
    
    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3
      });
    });
  });
}

// Initialize matrix rain effect
function initMatrixRain() {
  const canvas = document.createElement('canvas');
  canvas.className = 'matrix-rain';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Characters to display
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const charArray = chars.split('');
  
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  
  // Array to track the y position of each column
  const drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
  }
  
  // Drawing function
  function draw() {
    // Set semi-transparent black background to create trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text color and font
    ctx.fillStyle = '#0aff0a';
    ctx.font = `${fontSize}px monospace`;
    
    // Loop through each drop
    for (let i = 0; i < drops.length; i++) {
      // Choose a random character
      const text = charArray[Math.floor(Math.random() * charArray.length)];
      
      // Draw the character
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      // Move the drop down
      drops[i]++;
      
      // Reset drop position if it goes off screen or randomly
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      
      // Vary the color based on position
      if (Math.random() > 0.95) {
        ctx.fillStyle = '#00bcd4'; // Occasional blue character
      } else {
        ctx.fillStyle = '#0aff0a';
      }
    }
    
    requestAnimationFrame(draw);
  }
  
  draw();
  
  // Resize canvas when window is resized
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Recalculate columns
    const newColumns = canvas.width / fontSize;
    
    // Update drops array
    for (let i = 0; i < newColumns; i++) {
      if (!drops[i]) {
        drops[i] = Math.random() * -100;
      }
    }
  });
}

// Initialize 3D tilt effect for elements
function initTiltEffect() {
  const tiltElements = document.querySelectorAll('.tilt-effect');
  
  tiltElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPercent = x / rect.width;
      const yPercent = y / rect.height;
      
      const rotateX = (0.5 - yPercent) * 20;
      const rotateY = (xPercent - 0.5) * 20;
      
      gsap.to(element, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        transformOrigin: 'center center',
        ease: 'power2.out',
        duration: 0.4
      });
      
      // Add highlight effect
      const glare = element.querySelector('.tilt-glare') || document.createElement('div');
      if (!element.querySelector('.tilt-glare')) {
        glare.className = 'tilt-glare';
        element.appendChild(glare);
      }
      
      gsap.to(glare, {
        opacity: 0.2,
        x: `${xPercent * 100}%`,
        y: `${yPercent * 100}%`,
        duration: 0.4
      });
    });
    
    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.5)'
      });
      
      const glare = element.querySelector('.tilt-glare');
      if (glare) {
        gsap.to(glare, {
          opacity: 0,
          duration: 0.7
        });
      }
    });
  });
}

// Initialize floating tech stack animation
function initTechStackAnimation() {
  const techStackContainer = document.createElement('div');
  techStackContainer.className = 'tech-stack-container';
  document.body.appendChild(techStackContainer);
  
  const techIcons = [
    { name: 'react', color: '#61DAFB' },
    { name: 'js', color: '#F7DF1E' },
    { name: 'html5', color: '#E34F26' },
    { name: 'css3', color: '#1572B6' },
    { name: 'node-js', color: '#339933' },
    { name: 'github', color: '#ffffff' },
    { name: 'npm', color: '#CB3837' },
    { name: 'java', color: '#007396' },
    { name: 'python', color: '#3776AB' },
    { name: 'database', color: '#336791' },
    { name: 'code', color: '#007ACC' },
    { name: 'terminal', color: '#4EAA25' }
  ];
  
  techIcons.forEach(icon => {
    const iconElement = document.createElement('div');
    iconElement.className = 'tech-icon';
    iconElement.innerHTML = `<i class="fab fa-${icon.name}" style="color: ${icon.color}"></i>`;
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 1 + 1.5; // 1.5 to 2.5rem
    
    // Random opacity
    const opacity = Math.random() * 0.3 + 0.2; // 0.2 to 0.5
    
    // Random animation duration
    const duration = Math.random() * 40 + 20; // 20 to 60 seconds
    
    // Random delay
    const delay = Math.random() * 10;
    
    // Apply styles
    iconElement.style.left = `${posX}%`;
    iconElement.style.top = `${posY}%`;
    iconElement.style.fontSize = `${size}rem`;
    iconElement.style.opacity = opacity;
    iconElement.style.animationDuration = `${duration}s`;
    iconElement.style.animationDelay = `${delay}s`;
    
    // Add to container
    techStackContainer.appendChild(iconElement);
  });
}

// Initialize digital circuit background
function initDigitalCircuit() {
  const circuitContainer = document.createElement('div');
  circuitContainer.className = 'circuit-background';
  document.body.appendChild(circuitContainer);
  
  // Create circuit paths
  for (let i = 0; i < 20; i++) {
    const circuit = document.createElement('div');
    circuit.className = 'circuit-path';
    
    // Random position
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    
    // Random length and direction
    const length = Math.random() * 30 + 10;
    const angle = Math.floor(Math.random() * 4) * 90; // 0, 90, 180, or 270 degrees
    
    // Apply styles
    circuit.style.left = `${startX}%`;
    circuit.style.top = `${startY}%`;
    circuit.style.width = `${length}vw`;
    circuit.style.transform = `rotate(${angle}deg)`;
    circuit.style.animationDelay = `${Math.random() * 5}s`;
    
    // Add nodes
    const nodeCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < nodeCount; j++) {
      const node = document.createElement('div');
      node.className = 'circuit-node';
      node.style.left = `${(j + 1) * (100 / (nodeCount + 1))}%`;
      circuit.appendChild(node);
    }
    
    circuitContainer.appendChild(circuit);
  }
}

// Initialize binary code rain effect
function initBinaryRain() {
  const binaryContainer = document.createElement('div');
  binaryContainer.className = 'binary-rain';
  document.body.appendChild(binaryContainer);
  
  for (let i = 0; i < 20; i++) {
    const binaryStream = document.createElement('div');
    binaryStream.className = 'binary-stream';
    
    // Random position
    binaryStream.style.left = `${Math.random() * 100}%`;
    binaryStream.style.animationDuration = `${Math.random() * 10 + 5}s`;
    binaryStream.style.animationDelay = `${Math.random() * 5}s`;
    
    // Generate binary content
    let binaryContent = '';
    const streamLength = Math.floor(Math.random() * 20) + 10;
    for (let j = 0; j < streamLength; j++) {
      binaryContent += Math.random() > 0.5 ? '1' : '0';
      if (j < streamLength - 1) {
        binaryContent += '<br>';
      }
    }
    
    binaryStream.innerHTML = binaryContent;
    binaryContainer.appendChild(binaryStream);
  }
}

// Add holographic UI elements
function initHolographicUI() {
  // Create holographic elements container
  const holographicContainer = document.createElement('div');
  holographicContainer.className = 'holographic-container';
  document.body.appendChild(holographicContainer);
  
  // Add floating tech data elements
  for (let i = 0; i < 15; i++) {
    const dataElement = document.createElement('div');
    dataElement.className = 'holo-data';
    
    // Random content (binary, hex, or tech terms)
    const contentType = Math.floor(Math.random() * 3);
    if (contentType === 0) {
      // Binary
      let binary = '';
      for (let j = 0; j < 8; j++) {
        binary += Math.floor(Math.random() * 2);
      }
      dataElement.textContent = binary;
    } else if (contentType === 1) {
      // Hex
      let hex = '0x';
      for (let j = 0; j < 4; j++) {
        hex += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
      }
      dataElement.textContent = hex;
    } else {
      // Tech terms
      const terms = ['API', 'JSON', 'HTTP', 'REST', 'DOM', 'CSS', 'HTML', 'JS', 'NODE', 'REACT', 'GIT', 'SQL', 'AWS'];
      dataElement.textContent = terms[Math.floor(Math.random() * terms.length)];
    }
    
    // Random position
    dataElement.style.left = `${Math.random() * 100}vw`;
    dataElement.style.top = `${Math.random() * 100}vh`;
    
    // Random size
    const size = Math.random() * 0.5 + 0.7; // 0.7 to 1.2rem
    dataElement.style.fontSize = `${size}rem`;
    
    // Random opacity
    dataElement.style.opacity = Math.random() * 0.3 + 0.1; // 0.1 to 0.4
    
    // Random animation duration
    const duration = Math.random() * 20 + 10; // 10 to 30 seconds
    dataElement.style.animationDuration = `${duration}s`;
    
    // Random delay
    const delay = Math.random() * 5;
    dataElement.style.animationDelay = `${delay}s`;
    
    holographicContainer.appendChild(dataElement);
  }
  
  // Add radar scan effect
  const radar = document.createElement('div');
  radar.className = 'radar-scan';
  holographicContainer.appendChild(radar);
}

// Enhanced text readability function
function enhanceTextReadability() {
  // Add text outline effect for better contrast
  const textElements = document.querySelectorAll('h1, h2, h3, h4, p, .btn, nav a');
  
  textElements.forEach(element => {
    element.style.textShadow = '0 0 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.6)';
    
    // Add subtle glow to headings
    if (element.tagName.startsWith('H')) {
      element.style.textShadow += ', 0 0 5px rgba(0, 188, 212, 0.3)';
    }
  });
  
  // Reduce opacity of background effects
  const backgroundEffects = document.querySelectorAll('.matrix-rain, .tech-stack-container, .circuit-background, .binary-rain');
  
  backgroundEffects.forEach(effect => {
    effect.style.opacity = '0.08';
  });
  
  // Add backdrop blur to content sections for better readability
  const contentSections = document.querySelectorAll('.about-content, .skills-grid, .projects-grid, .experience-timeline, .contact-form');
  
  contentSections.forEach(section => {
    section.style.backdropFilter = 'blur(5px)';
    section.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
    section.style.borderRadius = '8px';
    section.style.padding = '20px';
  });
}

// Add CSS for new animations and UI elements
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  .holographic-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -2;
    overflow: hidden;
  }
  
  .holo-data {
    position: absolute;
    font-family: var(--font-code);
    color: rgba(0, 188, 212, 0.4);
    animation: float-data linear infinite;
    white-space: nowrap;
  }
  
  @keyframes float-data {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    100% {
      transform: translate(calc(-50vw + 50%), calc(50vh - 50%)) rotate(360deg);
    }
  }
  
  .radar-scan {
    position: fixed;
    bottom: -50vh;
    left: -50vh;
    width: 100vh;
    height: 100vh;
    border-radius: 50%;
    border: 1px solid rgba(0, 188, 212, 0.3);
    background: radial-gradient(circle, transparent 0%, transparent 50%, rgba(0, 188, 212, 0.1) 51%, transparent 52%, transparent 100%);
    animation: radar-rotate 10s linear infinite;
    opacity: 0.3;
    z-index: -3;
  }
  
  @keyframes radar-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  /* Improved text highlight effect */
  .highlight {
    position: relative;
    color: var(--primary-color);
    font-weight: 600;
  }
  
  .highlight::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background-color: rgba(0, 188, 212, 0.2);
    z-index: -1;
    transform: skewX(-15deg);
  }
  
  /* Add smooth scrolling for anchor links */
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 80px; /* Account for fixed header */
  }
  
  /* Add elegant transitions for all interactive elements */
  a, button, .btn, .skill-item, .project-card, .experience-item {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  /* Add subtle hover effect for buttons */
  .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 188, 212, 0.5);
  }
  
  /* Add focus styles for better accessibility */
  a:focus, button:focus, .btn:focus, input:focus, textarea:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
  
  /* Add loading animation for buttons */
  .btn.loading {
    position: relative;
    pointer-events: none;
  }
  
  .btn.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: translateY(-50%) rotate(360deg);
    }
  }
`;
document.head.appendChild(additionalStyles);

// Add interactive background elements that respond to mouse movement
function initInteractiveBackground() {
  const container = document.createElement('div');
  container.className = 'interactive-background';
  document.body.appendChild(container);
  
  // Create grid lines
  for (let i = 0; i < 20; i++) {
    const horizontalLine = document.createElement('div');
    horizontalLine.className = 'grid-line horizontal';
    horizontalLine.style.top = `${i * 5}vh`;
    
    const verticalLine = document.createElement('div');
    verticalLine.className = 'grid-line vertical';
    verticalLine.style.left = `${i * 5}vw`;
    
    container.appendChild(horizontalLine);
    container.appendChild(verticalLine);
  }
  
  // Create interactive nodes
  for (let i = 0; i < 30; i++) {
    const node = document.createElement('div');
    node.className = 'interactive-node';
    node.style.left = `${Math.random() * 100}vw`;
    node.style.top = `${Math.random() * 100}vh`;
    node.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(node);
  }
  
  // Add mouse move event listener
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    // Update grid lines
    document.querySelectorAll('.grid-line').forEach(line => {
      if (line.classList.contains('horizontal')) {
        line.style.transform = `translateX(${(mouseX - 0.5) * -20}px)`;
      } else {
        line.style.transform = `translateY(${(mouseY - 0.5) * -20}px)`;
      }
    });
    
    // Update nodes
    document.querySelectorAll('.interactive-node').forEach(node => {
      const rect = node.getBoundingClientRect();
      const nodeX = (rect.left + rect.width / 2) / window.innerWidth;
      const nodeY = (rect.top + rect.height / 2) / window.innerHeight;
      
      const distX = mouseX - nodeX;
      const distY = mouseY - nodeY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      if (distance < 0.2) {
        const strength = (0.2 - distance) * 5;
        const moveX = distX * strength * -100;
        const moveY = distY * strength * -100;
        node.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength})`;
        node.style.backgroundColor = `rgba(0, 188, 212, ${0.3 + strength})`;
        node.style.boxShadow = `0 0 ${15 + strength * 20}px rgba(0, 188, 212, ${0.5 + strength * 0.5})`;
      } else {
        node.style.transform = 'translate(0, 0) scale(1)';
        node.style.backgroundColor = 'rgba(0, 188, 212, 0.3)';
        node.style.boxShadow = '0 0 15px rgba(0, 188, 212, 0.5)';
      }
    });
  });
}

// Add CSS for interactive background
const interactiveStyles = document.createElement('style');
interactiveStyles.textContent = `
  .interactive-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -3;
    overflow: hidden;
  }
  
  .grid-line {
    position: absolute;
    background-color: rgba(0, 188, 212, 0.05);
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .grid-line.horizontal {
    width: 100%;
    height: 1px;
    left: 0;
  }
  
  .grid-line.vertical {
    width: 1px;
    height: 100%;
    top: 0;
  }
  
  .interactive-node {
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: rgba(0, 188, 212, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 15px rgba(0, 188, 212, 0.5);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                background-color 0.3s ease, 
                box-shadow 0.3s ease;
    animation: pulse-node 3s infinite alternate ease-in-out;
  }
  
  @keyframes pulse-node {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.5);
    }
  }
  
  /* Add connection lines between nodes when they're close */
  .node-connection {
    position: absolute;
    height: 1px;
    background: linear-gradient(90deg, rgba(0, 188, 212, 0.1), rgba(0, 188, 212, 0.3), rgba(0, 188, 212, 0.1));
    transform-origin: left center;
    z-index: -1;
  }
`;
document.head.appendChild(interactiveStyles);

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initCursorEffects();
  initTextAnimations();
  initHoverEffects();
  initTiltEffect();
  initTechStackAnimation();
  initMatrixRain();
  initDigitalCircuit();
  initBinaryRain();
  initHolographicUI();
  enhanceTextReadability();
  initInteractiveBackground();
  
  // Update navigation to remove Projects link
  const projectsNavLink = document.querySelector('nav ul li a[href="#projects"]');
  if (projectsNavLink) {
    projectsNavLink.parentElement.remove();
  }
});