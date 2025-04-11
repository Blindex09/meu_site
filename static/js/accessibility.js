/**
 * Accessibility enhancement functions for the website
 * Implements high contrast mode, font size adjustment, and keyboard navigation improvements
 */

// Wait for DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {
  // Initialize accessibility tools
  initHighContrastMode();
  initFontSizeAdjustment();
  initKeyboardNavigation();
  initMobileNavigation();
});

/**
 * High Contrast Mode Toggle
 * Toggles a class on the body element that activates high contrast CSS
 */
function initHighContrastMode() {
  const contrastToggleBtn = document.getElementById('contrast-toggle');
  
  if (!contrastToggleBtn) return;
  
  // Check for stored preference and apply if exists
  const storedContrast = localStorage.getItem('highContrast');
  if (storedContrast === 'true') {
    document.body.classList.add('high-contrast');
    contrastToggleBtn.setAttribute('aria-pressed', 'true');
    contrastToggleBtn.classList.add('active');
  }
  
  // Toggle high contrast mode on button click
  contrastToggleBtn.addEventListener('click', function() {
    const isActive = document.body.classList.toggle('high-contrast');
    
    // Save preference to localStorage
    localStorage.setItem('highContrast', isActive);
    
    // Update button state
    this.setAttribute('aria-pressed', isActive);
    this.classList.toggle('active', isActive);
    
    // Announce change to screen readers
    announceChange(isActive ? 'Modo de alto contraste ativado' : 'Modo de alto contraste desativado');
  });
}

/**
 * Font Size Adjustment
 * Increases or decreases font size by toggling a class on the body
 */
function initFontSizeAdjustment() {
  const fontSizeBtn = document.getElementById('font-size-toggle');
  
  if (!fontSizeBtn) return;
  
  // Check for stored preference and apply if exists
  const storedFontSize = localStorage.getItem('largerFont');
  if (storedFontSize === 'true') {
    document.body.classList.add('font-size-larger');
    fontSizeBtn.setAttribute('aria-pressed', 'true');
    fontSizeBtn.classList.add('active');
  }
  
  // Toggle font size on button click
  fontSizeBtn.addEventListener('click', function() {
    const isActive = document.body.classList.toggle('font-size-larger');
    
    // Save preference to localStorage
    localStorage.setItem('largerFont', isActive);
    
    // Update button state
    this.setAttribute('aria-pressed', isActive);
    this.classList.toggle('active', isActive);
    
    // Announce change to screen readers
    announceChange(isActive ? 'Tamanho de fonte aumentado' : 'Tamanho de fonte padrão restaurado');
  });
}

/**
 * Keyboard Navigation Improvements
 * Enhances keyboard navigation by adding helpful keyboard shortcuts
 */
function initKeyboardNavigation() {
  // Add specific keyboard shortcuts
  document.addEventListener('keydown', function(event) {
    // ALT + 1: Go to homepage
    if (event.altKey && event.key === '1') {
      event.preventDefault();
      window.location.href = '/';
    }
    
    // ALT + 2: Skip to main content
    if (event.altKey && event.key === '2') {
      event.preventDefault();
      document.getElementById('main-content').focus();
      
      // Ensure users know where they are
      announceChange('Navegado para o conteúdo principal');
    }
    
    // ALT + 3: Go to contact form
    if (event.altKey && event.key === '3') {
      event.preventDefault();
      window.location.href = '/contact';
    }
    
    // ALT + 4: Toggle high contrast
    if (event.altKey && event.key === '4') {
      event.preventDefault();
      document.getElementById('contrast-toggle')?.click();
    }
    
    // ALT + 5: Toggle font size
    if (event.altKey && event.key === '5') {
      event.preventDefault();
      document.getElementById('font-size-toggle')?.click();
    }
    
    // ESC: Close mobile menu if open
    if (event.key === 'Escape') {
      const mobileNav = document.querySelector('.site-nav');
      if (mobileNav && mobileNav.classList.contains('active')) {
        document.getElementById('nav-toggle')?.click();
      }
    }
  });
  
  // Enhance focus management for tabular navigation
  const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  
  focusableElements.forEach(element => {
    // Add a classname when element gets focus
    element.addEventListener('focus', function() {
      this.classList.add('focus-visible');
    });
    
    // Remove classname when element loses focus
    element.addEventListener('blur', function() {
      this.classList.remove('focus-visible');
    });
  });
}

/**
 * Mobile Navigation Toggle
 * Handles the mobile menu button and accessibility for mobile navigation
 */
function initMobileNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  
  if (!navToggle || !siteNav) return;
  
  navToggle.addEventListener('click', function() {
    const isExpanded = siteNav.classList.toggle('active');
    
    // Update ARIA attributes
    this.setAttribute('aria-expanded', isExpanded);
    
    // Set focus to the first nav link when menu opens
    if (isExpanded) {
      const firstNavLink = siteNav.querySelector('a');
      if (firstNavLink) {
        firstNavLink.focus();
      }
    }
  });
}

/**
 * Announce changes to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 */
function announceChange(message) {
  // Try to find an existing live region
  let liveRegion = document.getElementById('a11y-announce');
  
  // Create one if it doesn't exist
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'a11y-announce';
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
  }
  
  // Update the content to trigger announcement
  liveRegion.textContent = message;
  
  // Clear after a short delay to allow for multiple announcements
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 3000);
}
