// This file contains scroll-related animations and effects

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// Parallax scrolling effect for background elements
function initParallaxEffect() {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Move 3D objects based on scroll
    if (window.scene) {
      // Access scene objects and apply parallax
      window.scene.children.forEach(child => {
        if (child.type === 'Mesh' || child.type === 'Points') {
          child.position.y = child.userData.initialY + scrollY * 0.001;
        }
      });
    }
  });
}

// Initialize scroll-triggered animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Initialize scroll progress indicator
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    progressBar.style.width = `${scrollPercentage}%`;
  });
}

// Add CSS for scroll progress
const style = document.createElement('style');
style.textContent = `
  .scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(to right, #00bcd4, #6c63ff);
    z-index: 1000;
    width: 0%;
    transition: width 0.1s;
  }
  
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  
  .animate-on-scroll.animated {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

// Enhanced navigation highlighting system with improved section detection
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded - initializing enhanced navigation system");
  
  // Get all navigation links and sections
  const navLinks = document.querySelectorAll('nav ul li a');
  const sections = document.querySelectorAll('section[id]');
  
  // Debug information
  console.log(`Found ${navLinks.length} navigation links`);
  console.log(`Found ${sections.length} sections with IDs`);
  
  // Log all sections and their positions
  sections.forEach(section => {
    console.log(`Section #${section.id}: offsetTop = ${section.offsetTop}`);
  });
  
  // Function to determine active section with improved accuracy
  function setActiveLink() {
    // Get current scroll position with offset for earlier triggering
    const scrollPosition = window.scrollY + (window.innerHeight / 3);
    
    // Find the current section
    let currentSection = '';
    
    // Check each section's position
    sections.forEach(section => {
      // Get section boundaries with a more generous overlap
      const sectionTop = section.offsetTop - 200; // More generous offset
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.id;
      
      // Check if we're in this section
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection = sectionId;
      }
    });
    
    // Force-remove active class from ALL links first
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to the correct link
    if (currentSection) {
      const activeLink = document.querySelector(`nav ul li a[href="#${currentSection}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        console.log(`Active section: ${currentSection}`);
      }
    } else if (window.scrollY < 100) {
      // If at the top of the page, set home as active
      const homeLink = document.querySelector('nav ul li a[href="#home"]');
      if (homeLink) {
        homeLink.classList.add('active');
      }
    }
    
    // Update the nav indicator if it exists
    updateNavIndicator();
  }
  
  // Function to update the nav indicator position
  function updateNavIndicator() {
    const indicator = document.querySelector('.nav-indicator');
    const activeLink = document.querySelector('nav ul li a.active');
    
    if (indicator && activeLink) {
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = document.querySelector('nav ul').getBoundingClientRect();
      
      gsap.to(indicator, {
        width: linkRect.width,
        x: linkRect.left - navRect.left,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }
  
  // Add click event listeners to each nav link
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the target section
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Smooth scroll to the target section
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Manually update active link for immediate feedback
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        updateNavIndicator();
      }
      
      // Close mobile menu if open
      const menuToggle = document.querySelector('.menu-toggle');
      const nav = document.querySelector('nav');
      if (menuToggle && nav && nav.classList.contains('active')) {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  // Create nav indicator if it doesn't exist
  const navUl = document.querySelector('nav ul');
  if (navUl && !document.querySelector('.nav-indicator')) {
    const indicator = document.createElement('div');
    indicator.className = 'nav-indicator';
    navUl.appendChild(indicator);
    console.log('Nav indicator created');
  }
  
  // Add scroll event listener with throttling for better performance
  let lastScrollTime = 0;
  window.addEventListener('scroll', function() {
    const now = Date.now();
    if (now - lastScrollTime > 50) { // 50ms throttle
      lastScrollTime = now;
      setActiveLink();
    }
  });
  
  // Call once on page load
  setActiveLink();
  
  // Force update after a short delay to ensure all elements are properly loaded
  setTimeout(setActiveLink, 500);
  setTimeout(setActiveLink, 1000); // Additional check after 1 second
  
  // Also update on window resize
  window.addEventListener('resize', function() {
    setActiveLink();
    updateNavIndicator();
  });
});

// Fix mobile menu functionality
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  
  if (!menuToggle || !nav) {
    console.error('Menu toggle or nav element not found');
    return;
  }
  
  // Toggle mobile menu
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
    
    // Prevent scrolling when menu is open
    if (nav.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
}

// Initialize mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', initMobileMenu); 