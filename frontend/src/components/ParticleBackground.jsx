import { useEffect } from "react";

export default function ParticleBackground() {
  useEffect(() => {
    const createParticles = () => {
      const particleContainer = document.createElement('div');
      particleContainer.className = 'particles';
      document.body.appendChild(particleContainer);

      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        particleContainer.appendChild(particle);
      }
    };

    createParticles();

    return () => {
      const particles = document.querySelector('.particles');
      if (particles) particles.remove();
    };
  }, []);

  return null;
}