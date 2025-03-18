// Enhanced Three.js scene with more tech-focused animations
let scene, camera, renderer;
let particles, dataCubes = [], dataLines = [];
let clock;
let raycaster, mouse;
let animationFrameId;
let analyser, dataArray;

// DOM elements
const loadingScreen = document.querySelector('.loading-screen');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('nav ul li a');
const sections = document.querySelectorAll('.section');
const dynamicText = document.querySelector('.dynamic-text');

// Text typing effect data
const typingTexts = [
  'Software Engineer',
  'React Native Developer',
  'Web Developer',
  'JavaScript Developer',
  'CS Student'
];

// Add mouse movement interaction with background
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

// Track mouse position
document.addEventListener('mousemove', (event) => {
  targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
  targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Initialize the scene
function init() {
  // Create scene
  scene = new THREE.Scene();
  
  // Create camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 15;
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x121212, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);
  
  const pointLight = new THREE.PointLight(0x00bcd4, 1, 100);
  pointLight.position.set(5, 5, 5);
  pointLight.castShadow = true;
  scene.add(pointLight);
  
  const pointLight2 = new THREE.PointLight(0x6c63ff, 1, 100);
  pointLight2.position.set(-5, -5, 5);
  pointLight2.castShadow = true;
  scene.add(pointLight2);
  
  // Add directional light for better shadows
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 10, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add(directionalLight);
  
  // Initialize clock for animations
  clock = new THREE.Clock();
  
  // Initialize raycaster for mouse interactions
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  // Add event listeners
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onMouseMove);
  
  // Initialize particles
  initParticles();
  
  // Add 3D objects
  addObjects();
  
  // Add data visualization elements
  addDataVisualization();
  
  // Add grid
  addGrid();
  
  // Start animation loop
  animate();
  
  // Hide loading screen after everything is loaded
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.visibility = 'hidden';
  }, 2000);
}

// Initialize particle system with more complex shader
function initParticles() {
  // Create particle geometry
  const particleCount = window.innerWidth < 768 ? 2000 : 4000;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  // Create particles with varied positions, colors and sizes
  for (let i = 0; i < particleCount; i++) {
    // Position particles in a sphere
    const radius = Math.random() * 30 + 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    // Color gradient from primary to secondary
    const mixFactor = Math.random();
    colors[i * 3] = mixFactor * 0 + (1 - mixFactor) * 0.42; // R
    colors[i * 3 + 1] = mixFactor * 0.74 + (1 - mixFactor) * 0.39; // G
    colors[i * 3 + 2] = mixFactor * 0.83 + (1 - mixFactor) * 1.0; // B
    
    // Varied sizes
    sizes[i] = Math.random() * 0.1 + 0.05;
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // Create shader material for better-looking particles
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      mousePosition: { value: new THREE.Vector2(0, 0) }
    },
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      uniform float time;
      uniform vec2 mousePosition;
      
      void main() {
        vColor = color;
        
        // Add subtle movement based on time
        vec3 pos = position;
        float noise = sin(pos.x * 0.1 + time) * cos(pos.y * 0.1 + time) * sin(pos.z * 0.1 + time) * 0.5;
        
        // Add mouse interaction
        float dist = length(pos.xy - mousePosition * 10.0);
        float strength = 5.0 / (1.0 + dist * 0.1);
        vec2 direction = normalize(pos.xy - mousePosition * 10.0);
        pos.xy += direction * strength * (sin(time * 0.5) * 0.5 + 0.5);
        
        // Add noise to position
        pos.x += noise * 0.5;
        pos.y += noise * 0.5;
        pos.z += noise * 0.5;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      
      void main() {
        // Create circular particles
        float r = length(gl_PointCoord - vec2(0.5, 0.5));
        if (r > 0.5) discard;
        
        // Add glow effect
        float glow = 1.0 - r * 2.0;
        glow = pow(glow, 1.5);
        
        gl_FragColor = vec4(vColor, glow);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  });
  
  // Create particle system
  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
}

// Add 3D objects with more tech-focused designs
function addObjects() {
  // Add floating geometric shapes
  const shapes = [];
  
  // Digital circuit board
  const circuitGeometry = new THREE.PlaneGeometry(15, 15, 20, 20);
  const circuitMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      varying float vElevation;
      
      void main() {
        vUv = uv;
        
        // Create circuit-like elevation
        float elevation = 0.0;
        
        // Horizontal lines
        if (abs(fract(vUv.y * 10.0) - 0.5) < 0.05) {
          elevation = 0.1;
        }
        
        // Vertical lines
        if (abs(fract(vUv.x * 10.0) - 0.5) < 0.05) {
          elevation = 0.1;
        }
        
        // Nodes at intersections
        if (abs(fract(vUv.x * 10.0) - 0.5) < 0.05 && abs(fract(vUv.y * 10.0) - 0.5) < 0.05) {
          elevation = 0.2;
          
          // Animate some nodes
          if (floor(vUv.x * 10.0) + floor(vUv.y * 10.0) % 3 == 0) {
            elevation *= sin(time * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
          }
        }
        
        vElevation = elevation;
        
        // Apply elevation to vertex
        vec3 newPosition = position;
        newPosition.z += elevation;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      varying float vElevation;
      
      void main() {
        // Base color - dark
        vec3 color = vec3(0.05, 0.05, 0.1);
        
        // Circuit lines
        if (vElevation > 0.0) {
          // Glowing blue for circuit paths
          color = vec3(0.0, 0.8, 1.0) * (vElevation * 5.0);
          
          // Pulse effect on some lines
          if (floor(vUv.x * 10.0 + vUv.y * 10.0) % 3 == 0) {
            color *= sin(time * 3.0 + vUv.x * 5.0 + vUv.y * 5.0) * 0.5 + 0.5;
          }
          
          // Data flow effect
          float dataFlow = fract(vUv.x - time * 0.1) * fract(vUv.y + time * 0.05);
          if (dataFlow < 0.05 && vElevation > 0.05) {
            color = vec3(1.0, 1.0, 1.0);
          }
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    side: THREE.DoubleSide
  });
  
  const circuit = new THREE.Mesh(circuitGeometry, circuitMaterial);
  circuit.position.set(0, 0, -20);
  circuit.rotation.x = -Math.PI / 4;
  scene.add(circuit);
  shapes.push(circuit);
  
  // Holographic cube
  const cubeGeometry = new THREE.BoxGeometry(3, 3, 3, 10, 10, 10);
  const cubeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      uniform float time;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        vPosition = position;
        vNormal = normal;
        
        // Add subtle wave effect
        vec3 newPosition = position;
        newPosition += normal * sin(time + position.x * 2.0 + position.y * 2.0 + position.z * 2.0) * 0.05;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        // Holographic grid effect
        vec3 color = vec3(0.0, 0.8, 1.0);
        
        // Grid lines
        float gridX = abs(fract(vPosition.x * 5.0) - 0.5);
        float gridY = abs(fract(vPosition.y * 5.0) - 0.5);
        float gridZ = abs(fract(vPosition.z * 5.0) - 0.5);
        
        float grid = min(min(gridX, gridY), gridZ);
        
        if (grid < 0.05) {
          color = vec3(0.0, 1.0, 1.0);
        }
        
        // Edge highlighting
        float edge = max(max(abs(vNormal.x), abs(vNormal.y)), abs(vNormal.z));
        if (edge > 0.9) {
          color = mix(color, vec3(1.0, 1.0, 1.0), 0.5);
        }
        
        // Pulse effect
        color *= 0.5 + 0.5 * sin(time * 2.0);
        
        // Transparency based on angle
        float fresnel = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));
        fresnel = pow(1.0 - abs(fresnel), 2.0);
        
        gl_FragColor = vec4(color, 0.2 + fresnel * 0.5);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  });
  
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-8, 4, -10);
  scene.add(cube);
  shapes.push(cube);
  
  // Digital DNA helix
  const dnaGroup = new THREE.Group();
  
  const helixRadius = 2;
  const helixHeight = 10;
  const helixSegments = 40;
  const strandsCount = 2;
  const nodesPerStrand = 20;
  
  for (let s = 0; s < strandsCount; s++) {
    for (let i = 0; i < nodesPerStrand; i++) {
      const t = i / (nodesPerStrand - 1);
      const angle = t * Math.PI * 4 + (s * Math.PI);
      
      const x = Math.cos(angle) * helixRadius;
      const y = helixHeight * (t - 0.5);
      const z = Math.sin(angle) * helixRadius - 15;
      
      // Node
      const nodeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const nodeMaterial = new THREE.MeshStandardMaterial({
        color: s === 0 ? 0x00bcd4 : 0x6c63ff,
        emissive: s === 0 ? 0x00bcd4 : 0x6c63ff,
        emissiveIntensity: 0.5
      });
      
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(x, y, z);
      node.userData = { type: 'dnaNode', strand: s, index: i, baseY: y };
      dnaGroup.add(node);
      
      // Connect to previous node in same strand
      if (i > 0) {
        const prevNode = dnaGroup.children.find(
          child => child.userData.type === 'dnaNode' && 
                  child.userData.strand === s && 
                  child.userData.index === i - 1
        );
        
        if (prevNode) {
          const start = new THREE.Vector3().copy(prevNode.position);
          const end = new THREE.Vector3().copy(node.position);
          
          const connectionGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
          const connectionMaterial = new THREE.LineBasicMaterial({ 
            color: s === 0 ? 0x00bcd4 : 0x6c63ff,
            transparent: true,
            opacity: 0.7
          });
          
          const connection = new THREE.Line(connectionGeometry, connectionMaterial);
          connection.userData = { 
            type: 'dnaConnection', 
            strand: s, 
            startIndex: i - 1, 
            endIndex: i 
          };
          dnaGroup.add(connection);
        }
      }
      
      // Connect to opposite strand at certain intervals
      if (s === 0 && i % 2 === 0) {
        const oppositeAngle = angle + Math.PI;
        const oppositeX = Math.cos(oppositeAngle) * helixRadius;
        const oppositeZ = Math.sin(oppositeAngle) * helixRadius - 15;
        
        const start = new THREE.Vector3(x, y, z);
        const end = new THREE.Vector3(oppositeX, y, oppositeZ);
        
        const connectionGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const connectionMaterial = new THREE.LineDashedMaterial({ 
          color: 0xffeb3b,
          dashSize: 0.2,
          gapSize: 0.1,
          transparent: true,
          opacity: 0.7
        });
        
        const connection = new THREE.Line(connectionGeometry, connectionMaterial);
        connection.computeLineDistances();
        connection.userData = { type: 'dnaCrossConnection', index: i };
        dnaGroup.add(connection);
      }
    }
  }
  
  dnaGroup.position.set(8, 0, 0);
  scene.add(dnaGroup);
  shapes.push(dnaGroup);
  
  // Animate shapes
  shapes.forEach(shape => {
    if (shape.type === 'Group') {
      // For DNA helix, animate rotation and nodes
      gsap.to(shape.rotation, {
        y: Math.PI * 2,
        duration: 30,
        repeat: -1,
        ease: 'none'
      });
    } else {
      // For other shapes
      gsap.to(shape.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        z: Math.PI * 2,
        duration: 20 + Math.random() * 10,
        repeat: -1,
        ease: 'none'
      });
    }
  });
}

// Add data visualization elements
function addDataVisualization() {
  // Create data cubes - representing data blocks
  for (let i = 0; i < 50; i++) {
    const size = Math.random() * 0.5 + 0.2;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x00bcd4).lerp(new THREE.Color(0x6c63ff), Math.random()),
      transparent: true,
      opacity: 0.7,
      emissive: 0x00bcd4,
      emissiveIntensity: 0.3
    });
    
    const cube = new THREE.Mesh(geometry, material);
    
    // Position in a spiral pattern
    const angle = i * 0.2;
    const radius = 10 + i * 0.1;
    cube.position.x = Math.cos(angle) * radius;
    cube.position.z = Math.sin(angle) * radius - 30;
    cube.position.y = (Math.random() - 0.5) * 10;
    
    cube.rotation.x = Math.random() * Math.PI;
    cube.rotation.y = Math.random() * Math.PI;
    cube.rotation.z = Math.random() * Math.PI;
    
    // Store original position for animation
    cube.userData = {
      originalPosition: cube.position.clone(),
      speed: Math.random() * 0.02 + 0.01,
      amplitude: Math.random() * 0.5 + 0.5
    };
    
    scene.add(cube);
    dataCubes.push(cube);
  }
  
  // Create data flow lines
  for (let i = 0; i < 30; i++) {
    const points = [];
    const segmentCount = Math.floor(Math.random() * 5) + 3;
    
    // Create a path with multiple segments
    for (let j = 0; j <= segmentCount; j++) {
      const t = j / segmentCount;
      const angle = i * 0.2 + t * Math.PI;
      const radius = 10 + i * 0.1;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius - 30;
      const y = (Math.random() - 0.5) * 10 * t;
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    // Create pulsing shader material for data flow
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x00bcd4) }
      },
      vertexShader: `
        uniform float time;
        
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        
        void main() {
          float pulse = sin(time * 5.0 - gl_FragCoord.x * 0.1) * 0.5 + 0.5;
          gl_FragColor = vec4(color, pulse);
        }
      `,
      transparent: true
    });
    
    const line = new THREE.Line(geometry, material);
    line.userData = {
      speed: Math.random() * 0.5 + 0.5
    };
    
    scene.add(line);
    dataLines.push(line);
  }
}

// Add grid for tech feel
function addGrid() {
  // Main grid
  const gridHelper = new THREE.GridHelper(100, 100, 0x6c63ff, 0x222222);
  gridHelper.position.y = -10;
  scene.add(gridHelper);
  
  // Animated grid with shader
  const gridGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
  const gridMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        
        // Create wave effect
        vec3 pos = position;
        float wave = sin(pos.x * 0.05 + time) * cos(pos.z * 0.05 + time) * 2.0;
        pos.y += wave;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      
      void main() {
        // Grid lines
        float gridX = abs(fract(vUv.x * 50.0) - 0.5);
        float gridY = abs(fract(vUv.y * 50.0) - 0.5);
        
        float grid = min(gridX, gridY);
        
        // Pulse effect
        float pulse = sin(time * 2.0 + vUv.x * 10.0 + vUv.y * 10.0) * 0.5 + 0.5;
        
        // Color
        vec3 color = vec3(0.0, 0.4, 0.8) * pulse;
        
        // Fade grid lines
        float alpha = 0.0;
        if (grid < 0.02) {
          alpha = 0.2;
        }
        
        // Highlight some intersections
        if (gridX < 0.02 && gridY < 0.02) {
          alpha = 0.5;
          color = vec3(0.0, 0.8, 1.0) * pulse;
        }
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  });
  
  const grid = new THREE.Mesh(gridGeometry, gridMaterial);
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = -10;
  scene.add(grid);
}

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle mouse movement
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // Update mouse position for particle system
  if (particles && particles.material.uniforms.mousePosition) {
    // Convert screen coordinates to world coordinates (approximate)
    particles.material.uniforms.mousePosition.value.x = mouse.x * 10;
    particles.material.uniforms.mousePosition.value.y = mouse.y * 10;
  }
}

// Animation loop
function animate() {
  animationFrameId = requestAnimationFrame(animate);
  
  // Smooth mouse movement
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;
  
  // Update particle uniforms
  if (particles && particles.material.uniforms) {
    particles.material.uniforms.time.value += 0.01;
    particles.material.uniforms.mousePosition.value.set(mouseX, mouseY);
  }
  
  // Rotate particles based on mouse position
  if (particles) {
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;
    
    // Add mouse influence
    particles.rotation.x += mouseY * 0.001;
    particles.rotation.y += mouseX * 0.001;
  }
  
  // Update data cubes
  dataCubes.forEach((cube, i) => {
    cube.rotation.x += 0.01 * (i % 3 + 1);
    cube.rotation.y += 0.01 * ((i + 1) % 3 + 1);
    
    // Add mouse influence
    cube.position.x += mouseX * 0.01 * Math.sin(Date.now() * 0.001 + i);
    cube.position.y += mouseY * 0.01 * Math.cos(Date.now() * 0.001 + i);
    
    // Reset position if too far
    if (Math.abs(cube.position.x) > 20) cube.position.x *= 0.95;
    if (Math.abs(cube.position.y) > 20) cube.position.y *= 0.95;
  });
  
  // Update data lines
  dataLines.forEach((line, i) => {
    const positions = line.geometry.attributes.position.array;
    for (let j = 0; j < positions.length; j += 3) {
      positions[j] += Math.sin(Date.now() * 0.001 + j + i) * 0.01 * mouseX;
      positions[j + 1] += Math.cos(Date.now() * 0.001 + j + i) * 0.01 * mouseY;
    }
    line.geometry.attributes.position.needsUpdate = true;
  });
  
  // Update camera based on mouse position (subtle effect)
  camera.position.x += (mouseX * 2 - camera.position.x) * 0.01;
  camera.position.y += (mouseY * 2 - camera.position.y) * 0.01;
  camera.lookAt(scene.position);
  
  renderer.render(scene, camera);
}

// Initialize typing effect
function initTypingEffect() {
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function type() {
    const currentText = typingTexts[textIndex];
    
    if (isDeleting) {
      dynamicText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      dynamicText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = 1000; // Pause at the end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % typingTexts.length;
      typingSpeed = 500; // Pause before typing next
    }
    
    setTimeout(type, typingSpeed);
  }
  
  type();
}

// Add a dark overlay to improve text readability
function addDarkOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'dark-overlay';
  document.body.appendChild(overlay);
}

// Enhanced scroll animations with more elegant transitions
function initScrollAnimations() {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);
  
  // Animate section titles with elegant reveal
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.fromTo(title, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
    
    // Add line drawing animation for the underline
    const line = title.querySelector('::after') || title;
    gsap.fromTo(line, 
      { width: 0 },
      {
        width: '60px',
        duration: 1.5,
        ease: "power2.out",
        delay: 0.3,
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
  
  // Animate skill items with staggered reveal
  gsap.utils.toArray('.skills-grid .skill-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: i * 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
  
  // Animate project cards with elegant staggered reveal
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 80, rotateY: 15 },
      {
        opacity: 1,
        y: 0,
        rotateY: 0,
        duration: 1,
        delay: i * 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
  
  // Animate experience timeline with drawing effect
  const timeline = document.querySelector('.experience-timeline');
  if (timeline) {
    gsap.fromTo(timeline.querySelector('::before'),
      { height: 0 },
      {
        height: '100%',
        duration: 2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: timeline,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1
        }
      }
    );
    
    // Animate experience items
    gsap.utils.toArray('.experience-item').forEach((item, i) => {
      // Animate the dot first
      const dot = item.querySelector('.experience-dot');
      if (dot) {
        gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            delay: i * 0.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
      
      // Then animate the content
      gsap.fromTo(item,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: i * 0.2 + 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }
}

// Initialize event listeners
function initEventListeners() {
  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
  
  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
  
  // Form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Here you would typically send the form data to a server
      // For now, we'll just show a success message
      const formData = new FormData(contactForm);
      const formValues = Object.fromEntries(formData.entries());
      
      console.log('Form submitted:', formValues);
      
      // Reset form
      contactForm.reset();
      
      // Show success message (you could add a proper notification system)
      alert('Thank you for your message! I will get back to you soon.');
    });
  }
}

// Completely fix the scrolling issue
function fixScrollingIssue() {
  // Wait for everything to be loaded
  if (document.readyState !== 'complete') {
    return;
  }
  
  // Fix the body height
  document.body.style.minHeight = '100vh';
  document.body.style.overflow = 'auto';
  
  // Fix the canvas
  const canvas = document.getElementById('bg');
  if (canvas) {
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
  }
  
  // Remove any tech showcase elements
  const techShowcase = document.querySelector('.tech-showcase');
  if (techShowcase) {
    techShowcase.remove();
  }
  
  // Fix the last section
  const lastSection = document.querySelector('.section:last-of-type');
  if (lastSection) {
    lastSection.style.marginBottom = '0';
    lastSection.style.paddingBottom = '0';
  }
  
  // Fix the footer
  const footer = document.querySelector('footer');
  if (footer) {
    footer.style.marginBottom = '0';
  }
  
  // Prevent scrolling beyond content
  document.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;
    
    if (scrollTop + clientHeight >= scrollHeight) {
      window.scrollTo(0, scrollHeight - clientHeight - 1);
    }
  });
}

// Enhanced navbar functionality
function initNavbar() {
  const header = document.querySelector('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav ul li a');
  
  // Handle scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Handle menu toggle
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
    
    // Prevent body scrolling when menu is open
    if (nav.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Add hover animation for nav links
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        color: 'var(--primary-color)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    link.addEventListener('mouseleave', () => {
      if (!link.classList.contains('active')) {
        gsap.to(link, {
          color: 'var(--text-color)',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  });
  
  // Add glowing effect to logo
  const logo = document.querySelector('.logo');
  logo.addEventListener('mouseenter', () => {
    gsap.to(logo, {
      textShadow: '0 0 15px rgba(0, 188, 212, 0.8), 0 0 30px rgba(0, 188, 212, 0.4)',
      scale: 1.05,
      duration: 0.3
    });
  });
  
  logo.addEventListener('mouseleave', () => {
    gsap.to(logo, {
      textShadow: 'var(--glow)',
      scale: 1,
      duration: 0.3
    });
  });
  
  // Add this to your initNavbar function
  function createNavIndicator() {
    const navUl = document.querySelector('nav ul');
    const indicator = document.createElement('div');
    indicator.className = 'nav-indicator';
    navUl.appendChild(indicator);
    
    function updateIndicator(link) {
      const linkRect = link.getBoundingClientRect();
      const navRect = navUl.getBoundingClientRect();
      
      gsap.to(indicator, {
        width: linkRect.width,
        x: linkRect.left - navRect.left,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    // Update indicator on scroll
    function updateIndicatorOnScroll() {
      const activeLink = document.querySelector('nav ul li a.active');
      if (activeLink) {
        updateIndicator(activeLink);
      } else {
        gsap.to(indicator, {
          opacity: 0,
          duration: 0.3
        });
      }
    }
    
    window.addEventListener('scroll', updateIndicatorOnScroll);
    window.addEventListener('resize', updateIndicatorOnScroll);
    
    // Update on hover
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        updateIndicator(link);
      });
      
      link.addEventListener('mouseleave', () => {
        const activeLink = document.querySelector('nav ul li a.active');
        if (activeLink) {
          updateIndicator(activeLink);
        } else {
          gsap.to(indicator, {
            opacity: 0,
            duration: 0.3
          });
        }
      });
    });
    
    // Initial update
    setTimeout(updateIndicatorOnScroll, 500);
  }
  
  // Call this function in your initNavbar function
  createNavIndicator();
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize core functionality
  init();
  if (typeof addDarkOverlay === 'function') addDarkOverlay();
  if (typeof initTypingEffect === 'function') initTypingEffect();
  if (typeof initScrollAnimations === 'function') initScrollAnimations();
  if (typeof initEventListeners === 'function') initEventListeners();
  if (typeof enhanceTextReadability === 'function') enhanceTextReadability();
  
  // Apply the scroll fix after everything is loaded
  window.addEventListener('load', () => {
    setTimeout(fixScrollingIssue, 500);
  });
  
  // Initialize navbar functionality
  initNavbar();
});