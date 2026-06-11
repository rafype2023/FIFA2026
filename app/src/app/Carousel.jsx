"use client";
import React, { useState, useEffect } from "react";

const IMAGES = [
  "/Notas/nota1.png",
  "/Notas/nota2.png",
  "/Notas/nota3.png",
  "/Notas/nota4.png",
  "/Notas/nota5.png",
  "/Notas/nota6.png",
  "/Notas/nota7.png",
  "/Notas/nota8.png",
  "/Notas/nota9.png",
];

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 70; // Update every 70ms (100 times for 7 seconds)
    const increment = 100 / (7000 / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + IMAGES.length) % IMAGES.length);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    setProgress(0);
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
    setProgress(0);
  };

  // Close lightbox with ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="glass-panel carousel-card">
      <div className="carousel-title-area">
        <h2>Notas Importantes</h2>
        <p>Predicciones cerradas. Revisa las notas del torneo a continuación.</p>
      </div>

      <div 
        className="carousel-viewport"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={() => setLightboxOpen(true)}
        title="Haga clic para ampliar la imagen"
      >
        {IMAGES.map((src, index) => (
          <div 
            key={src} 
            className={`carousel-slide ${index === activeIndex ? "active" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={src} 
              alt={`Nota ${index + 1}`} 
              className="carousel-img"
            />
          </div>
        ))}

        <button 
          className="carousel-btn carousel-btn-prev"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Anterior"
        >
          ‹
        </button>
        <button 
          className="carousel-btn carousel-btn-next"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Siguiente"
        >
          ›
        </button>
      </div>

      <div className="carousel-controls-bottom">
        <div className="carousel-progress-container">
          <div 
            className="carousel-progress-bar" 
            style={{ width: `${progress}%`, transition: isPaused ? "none" : "width 70ms linear" }}
          />
        </div>

        <div className="carousel-dots">
          {IMAGES.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === activeIndex ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleDotClick(index);
              }}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <div 
          className="lightbox-overlay"
          onClick={() => setLightboxOpen(false)}
        >
          <div 
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="lightbox-close"
              onClick={() => setLightboxOpen(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={IMAGES[activeIndex]} 
              alt={`Nota ampliada ${activeIndex + 1}`} 
              className="lightbox-img"
            />
          </div>
        </div>
      )}
    </div>
  );
}
