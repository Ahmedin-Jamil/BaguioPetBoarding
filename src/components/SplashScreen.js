import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import '../assets/logo192.png';
import './SplashScreen.css';

const SITE_KEY = '6LfPX00rAAAAAKPN3lU7gs9pQ25a-8QLsmgXziHr';  // Your reCAPTCHA v2 site key



const SplashScreen = ({ onFinished, displayTime = 5000 }) => {
  const isAdminPage = window.location.hash.includes('/admin');
    const [fadeOut, setFadeOut] = useState(false);
  const [verified, setVerified] = useState(isAdminPage);

  // first effect: auto-verify for admin
  useEffect(() => {
    if (isAdminPage) {
      setVerified(true);
    }
  }, [isAdminPage]);

  // second effect: once verified, start fade-out and call onFinished
  useEffect(() => {
    if (!verified) return; // wait until captcha completed (or admin auto-verified)

    // Start fade out after a brief delay
    const timer = setTimeout(() => setFadeOut(true), 500);

    // Call onFinished callback after fade animation
    const completeTimer = setTimeout(() => {
      if (onFinished) onFinished();
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [verified, onFinished]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="logo-container">
          <img 
            src={require('../assets/logo192.png')} 
            alt="Pet Boarding Logo" 
            className="splash-logo"
          />
        </div>
        <div className="welcome-text">
          <h1 className="welcome-title">Welcome to</h1>
          <h2 className="brand-name">Baguio Pet Boarding</h2>
          <p className="tagline">Your Pet's Extended Home</p>
        </div>

        {/* reCAPTCHA verification (customers only) */}
        {!isAdminPage && !verified && (
          <div className="captcha-wrapper">
            <ReCAPTCHA sitekey={SITE_KEY} onChange={() => setVerified(true)} />
          </div>
        )}

        <div className="pet-animations">
          <div className="dog-animation"></div>
          <div className="cat-animation"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;