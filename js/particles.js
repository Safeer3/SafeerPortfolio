// This file contains additional particle effects for the background

// Create floating code particles
function createCodeParticles() {
  const codeParticlesContainer = document.createElement('div');
  codeParticlesContainer.className = 'code-particles';
  document.body.appendChild(codeParticlesContainer);
  
  const codeSnippets = [
    '{ }',
    '[ ]',
    '()',
    '=>',
    '&&',
    '||',
    '++',
    '==',
    '===',
    '!=',
    '!==',
    'if',
    'for',
    'while',
    'function',
    'return',
    'const',
    'let',
    'var',
    'import',
    'export',
    'class',
    'extends',
    'async',
    'await',
    'try',
    'catch',
    '</>',
    '<div>',
    '</div>',
    '<span>',
    '</span>',
    '<React.Fragment>',
    'useState',
    'useEffect',
    'useContext',
    'useRef',
    'useMemo',
    'useCallback',
    'useReducer',
    'props',
    'state',
    'render()',
    'componentDidMount()',
    'componentDidUpdate()',
    'componentWillUnmount()'
  ];
  
  // Create particles
  for (let i = 0; i < 40; i++) {
    createCodeParticle(codeParticlesContainer, codeSnippets);
  }
}

function createCodeParticle(container, codeSnippets) {
  const particle = document.createElement('div');
  particle.className = 'code-particle';
  
  // Random code snippet
  const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
  particle.textContent = randomSnippet;
  
  // Random position
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  
  // Random size
  const size = Math.random() * 0.8 + 0.6; // 0.6 to 1.4rem
  
  // Random opacity
  const opacity = Math.random() * 0.5 + 0.1; // 0.1 to 0.6
  
  // Random animation duration
  const duration = Math.random() * 60 + 30; // 30 to 90 seconds
  
  // Random delay
  const delay = Math.random() * 10;
  
  // Apply styles
  particle.style.left = `${posX}%`;
  particle.style.top = `${posY}%`;
  particle.style.fontSize = `${size}rem`;
  particle.style.opacity = opacity;
  particle.style.animationDuration = `${duration}s`;
  particle.style.animationDelay = `${delay}s`;
  
  // Add to container
  container.appendChild(particle);
  
  // Remove and recreate particle after animation ends
  setTimeout(() => {
    particle.remove();
    createCodeParticle(container, codeSnippets);
  }, (duration + delay) * 1000);
}

// Initialize code particles
document.addEventListener('DOMContentLoaded', () => {
  createCodeParticles();
});

// Add CSS for code particles
const style = document.createElement('style');
style.textContent = `
  .code-particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    overflow: hidden;
  }
  
  .code-particle {
    position: absolute;
    color: rgba(0, 188, 212, 0.3);
    font-family: 'Fira Code', monospace;
    animation: floatUp linear forwards;
    white-space: nowrap;
  }
  
  @keyframes floatUp {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    100% {
      transform: translateY(-100vh) rotate(360deg);
    }
  }
`;
document.head.appendChild(style); 