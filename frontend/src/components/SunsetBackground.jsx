import { useEffect } from "react";

export default function SunsetBackground() {
  useEffect(() => {
    // Only create sunset effect in light mode
    if (!document.body.classList.contains('dark')) {
      createSunsetEffects();
    }
    
    return () => {
      // Cleanup all sunset elements
      const elements = document.querySelectorAll('.purple-cloud, .warm-glow, .bird, .sun-glow, .floating-particle');
      elements.forEach(el => el.remove());
    };
  }, []);

  const createSunsetEffects = () => {
    // Create Sun Glow Effect
    const sunGlow = document.createElement('div');
    sunGlow.className = 'sun-glow';
    sunGlow.style.cssText = `
      position: fixed;
      bottom: 15%;
      right: 10%;
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(255, 200, 100, 0.4), rgba(255, 160, 80, 0.1), transparent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      animation: sunPulse 6s ease-in-out infinite;
    `;
    document.body.appendChild(sunGlow);
    
    // Create Purple Clouds
    const cloudPositions = [5, 15, 30, 45, 60, 75, 85];
    cloudPositions.forEach((position, index) => {
      const cloud = document.createElement('div');
      cloud.className = 'purple-cloud';
      cloud.style.cssText = `
        position: fixed;
        background: radial-gradient(ellipse, rgba(139, 61, 110, 0.2), rgba(107, 45, 92, 0.05));
        border-radius: 50%;
        filter: blur(40px);
        pointer-events: none;
        z-index: 0;
        width: ${Math.random() * 200 + 150}px;
        height: ${Math.random() * 80 + 60}px;
        left: ${position}%;
        top: ${Math.random() * 25 + 5}%;
        animation: cloudFloat ${Math.random() * 15 + 20}s ease-in-out infinite;
        animation-delay: ${index * 3}s;
      `;
      document.body.appendChild(cloud);
    });
    
    // Create Warm Glow Overlay
    const warmGlow = document.createElement('div');
    warmGlow.className = 'warm-glow';
    warmGlow.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(ellipse at 50% 60%, rgba(255, 200, 100, 0.08), rgba(255, 160, 80, 0.04), transparent);
      pointer-events: none;
      z-index: 0;
      animation: warmPulse 8s ease-in-out infinite;
    `;
    document.body.appendChild(warmGlow);
    
    // Create Floating Particles (Dust motes in sunlight)
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(255, 200, 100, 0.4);
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: floatParticle ${Math.random() * 8 + 6}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
        filter: blur(1px);
      `;
      document.body.appendChild(particle);
    }
    
    // Create Birds
    const birdCount = 5;
    for (let i = 0; i < birdCount; i++) {
      const bird = document.createElement('div');
      bird.className = 'bird';
      bird.style.cssText = `
        position: fixed;
        font-size: 16px;
        color: #2c2c2c;
        opacity: 0.35;
        pointer-events: none;
        z-index: 1;
        top: ${Math.random() * 40 + 10}%;
        animation: birdFly ${Math.random() * 10 + 12}s linear infinite;
        animation-delay: ${i * 4}s;
      `;
      bird.innerHTML = '🐦';
      document.body.appendChild(bird);
    }
  };

  // Add keyframe styles to document
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes sunPulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }
      
      @keyframes cloudFloat {
        0%, 100% { transform: translateX(-5%) translateY(0); }
        50% { transform: translateX(5%) translateY(-10px); }
      }
      
      @keyframes warmPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }
      
      @keyframes floatParticle {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
        20% { opacity: 0.5; }
        80% { opacity: 0.5; }
        100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
      }
      
      @keyframes birdFly {
        0% { transform: translateX(-100px) translateY(0); opacity: 0; }
        10% { opacity: 0.35; }
        90% { opacity: 0.35; }
        100% { transform: translateX(calc(100vw + 100px)) translateY(-30px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      style.remove();
    };
  }, []);

  return null;
}