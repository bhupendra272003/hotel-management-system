import { useEffect } from "react";

export default function RainEffect() {
  useEffect(() => {
    // Only create rain effect in dark mode
    if (document.body.classList.contains('dark')) {
      createRainEffect();
    }
    
    return () => {
      // Cleanup rain elements
      const elements = document.querySelectorAll('.rain-container, .lightning, .lightning-bolt, .rain-mist, .thunder, .puddle, .window-rain');
      elements.forEach(el => el.remove());
    };
  }, []);

  const createRainEffect = () => {
    // Create keyframe styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainFall {
        0% { transform: translateY(-100vh); opacity: 1; }
        100% { transform: translateY(100vh); opacity: 0; }
      }
      
      @keyframes lightningFlash {
        0%, 90%, 100% { opacity: 0; }
        92% { opacity: 0.3; }
        93% { opacity: 0.6; }
        94% { opacity: 0.2; }
        95% { opacity: 0; }
      }
      
      @keyframes mistMove {
        0%, 100% { opacity: 0.3; transform: translateY(0); }
        50% { opacity: 0.6; transform: translateY(-10px); }
      }
      
      @keyframes thunderPulse {
        0%, 90%, 100% { opacity: 0; transform: scale(1); }
        92%, 94% { opacity: 0.8; transform: scale(1.2); }
        93% { opacity: 1; transform: scale(1.5); }
      }
      
      @keyframes puddleRipple {
        0%, 100% { background-position: 0 0; }
        50% { background-position: 100px 0; }
      }
      
      @keyframes windowRain {
        0% { background-position: 0 0; }
        100% { background-position: 0 100px; }
      }
    `;
    document.head.appendChild(style);
    
    // Create main rain container
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    rainContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
    `;
    document.body.appendChild(rainContainer);
    
    // Normal rain drops
    const rainDrops = document.createElement('div');
    rainDrops.className = 'rain-drops';
    rainDrops.style.cssText = `
      position: absolute;
      top: -10%;
      left: 0;
      width: 100%;
      height: 110%;
      pointer-events: none;
    `;
    
    for (let i = 0; i < 120; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.cssText = `
        position: absolute;
        background: linear-gradient(180deg, rgba(150, 180, 255, 0.6), rgba(100, 130, 200, 0.2));
        width: ${Math.random() * 2 + 1}px;
        height: ${Math.random() * 15 + 10}px;
        left: ${Math.random() * 100}%;
        animation: rainFall ${Math.random() * 1 + 0.5}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
        border-radius: 0 0 2px 2px;
      `;
      rainDrops.appendChild(drop);
    }
    rainContainer.appendChild(rainDrops);
    
    // Heavy rain drops
    const heavyRain = document.createElement('div');
    heavyRain.className = 'rain-heavy';
    heavyRain.style.cssText = `
      position: absolute;
      top: -10%;
      left: 0;
      width: 100%;
      height: 110%;
      pointer-events: none;
    `;
    
    for (let i = 0; i < 70; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.cssText = `
        position: absolute;
        background: linear-gradient(180deg, rgba(180, 200, 255, 0.5), rgba(120, 150, 220, 0.2));
        width: ${Math.random() * 3 + 2}px;
        height: ${Math.random() * 20 + 15}px;
        left: ${Math.random() * 100}%;
        animation: rainFall ${Math.random() * 0.8 + 0.4}s linear infinite;
        animation-delay: ${Math.random() * 3}s;
        border-radius: 0 0 2px 2px;
      `;
      heavyRain.appendChild(drop);
    }
    rainContainer.appendChild(heavyRain);
    
    // Lightning flash
    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    lightning.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      pointer-events: none;
      z-index: 2;
      animation: lightningFlash 8s infinite;
      opacity: 0;
    `;
    document.body.appendChild(lightning);
    
    // Lightning bolt
    const lightningBolt = document.createElement('div');
    lightningBolt.className = 'lightning-bolt';
    lightningBolt.style.cssText = `
      position: fixed;
      top: 0;
      left: 20%;
      width: 10px;
      height: 100%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(255, 200, 100, 0.4));
      filter: blur(5px);
      pointer-events: none;
      z-index: 2;
      animation: lightningFlash 8s infinite;
      opacity: 0;
    `;
    document.body.appendChild(lightningBolt);
    
    // Mist/fog effect
    const mist = document.createElement('div');
    mist.className = 'rain-mist';
    mist.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 40%;
      background: linear-gradient(180deg, rgba(72, 112, 128, 0) 0%, rgba(72, 112, 128, 0.15) 100%);
      pointer-events: none;
      z-index: 1;
      animation: mistMove 10s ease-in-out infinite;
    `;
    document.body.appendChild(mist);
    
    // Thunder effect
    const thunder = document.createElement('div');
    thunder.className = 'thunder';
    thunder.style.cssText = `
      position: fixed;
      bottom: 10%;
      right: 5%;
      font-size: 24px;
      color: rgba(255, 255, 255, 0.3);
      pointer-events: none;
      z-index: 1;
      animation: thunderPulse 8s infinite;
    `;
    thunder.innerHTML = '⚡';
    document.body.appendChild(thunder);
    
    // Puddles on ground
    const puddle = document.createElement('div');
    puddle.className = 'puddle';
    puddle.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 15px;
      background: repeating-linear-gradient(90deg, rgba(72, 112, 128, 0.3) 0px, rgba(72, 112, 128, 0.3) 50px, rgba(72, 112, 128, 0.1) 50px, rgba(72, 112, 128, 0.1) 100px);
      pointer-events: none;
      z-index: 1;
      animation: puddleRipple 3s ease-in-out infinite;
    `;
    document.body.appendChild(puddle);
    
    // Window rain streaks
    const windowRain = document.createElement('div');
    windowRain.className = 'window-rain';
    windowRain.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      background: repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(150, 180, 255, 0.03) 50px, rgba(150, 180, 255, 0.03) 52px);
      animation: windowRain 0.5s linear infinite;
    `;
    document.body.appendChild(windowRain);
    
    return () => {
      style.remove();
    };
  };

  return null;
}