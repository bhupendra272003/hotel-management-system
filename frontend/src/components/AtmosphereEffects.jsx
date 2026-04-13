import { useEffect } from "react";

export default function AtmosphereEffects() {
  useEffect(() => {
    const isDarkMode = document.body.classList.contains('dark');
    
    if (isDarkMode) {
      // Create Rain Effect for Dark Mode
      createRainEffect();
      // Create Lightning Effect
      createLightningEffect();
      // Create Mist Effect
      createMistEffect();
    } else {
      // Create Sun Effect for Light Mode
      createSunEffect();
      // Create Clouds Effect
      createCloudsEffect();
    }
    
    return () => {
      // Cleanup all effects
      const rainDrops = document.querySelectorAll('.rain-drop');
      rainDrops.forEach(drop => drop.remove());
      const lightning = document.querySelector('.lightning-flash');
      if (lightning) lightning.remove();
      const mist = document.querySelector('.rain-mist');
      if (mist) mist.remove();
      const sun = document.querySelector('.sun');
      if (sun) sun.remove();
      const clouds = document.querySelectorAll('.cloud');
      clouds.forEach(cloud => cloud.remove());
    };
  }, []);

  const createRainEffect = () => {
    // Create rain container
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    rainContainer.style.position = 'fixed';
    rainContainer.style.top = '0';
    rainContainer.style.left = '0';
    rainContainer.style.width = '100%';
    rainContainer.style.height = '100%';
    rainContainer.style.pointerEvents = 'none';
    rainContainer.style.zIndex = '-1';
    document.body.appendChild(rainContainer);
    
    // Create 150 rain drops
    for (let i = 0; i < 150; i++) {
      const raindrop = document.createElement('div');
      raindrop.className = 'rain-drop';
      raindrop.style.left = `${Math.random() * 100}%`;
      raindrop.style.animationDelay = `${Math.random() * 5}s`;
      raindrop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
      raindrop.style.width = `${Math.random() * 3 + 1}px`;
      raindrop.style.height = `${Math.random() * 15 + 10}px`;
      rainContainer.appendChild(raindrop);
    }
  };

  const createLightningEffect = () => {
    const lightning = document.createElement('div');
    lightning.className = 'lightning-flash';
    document.body.appendChild(lightning);
  };

  const createMistEffect = () => {
    const mist = document.createElement('div');
    mist.className = 'rain-mist';
    document.body.appendChild(mist);
  };

  const createSunEffect = () => {
    const sun = document.createElement('div');
    sun.className = 'sun';
    document.body.appendChild(sun);
  };

  const createCloudsEffect = () => {
    const cloudPositions = ['10%', '30%', '50%', '70%', '90%'];
    const cloudDelays = [0, 5, 10, 15, 20];
    
    cloudPositions.forEach((position, index) => {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      cloud.style.position = 'fixed';
      cloud.style.top = `${Math.random() * 30 + 10}%`;
      cloud.style.left = position;
      cloud.style.width = `${Math.random() * 200 + 100}px`;
      cloud.style.height = `${Math.random() * 100 + 50}px`;
      cloud.style.animationDelay = `${cloudDelays[index]}s`;
      cloud.style.animationDuration = `${Math.random() * 20 + 30}s`;
      document.body.appendChild(cloud);
    });
  };

  return null;
}