/**
 * Interactive Demonstrations of Accessibility Principles
 * Provides interactive examples to demonstrate accessibility concepts
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive demos
  initContrastDemo();
  initKeyboardTrapDemo();
  initAltTextDemo();
  initAriaDemo();
  initSemanticStructureDemo();
  initErrorMessageDemo();
});

/**
 * Contrast Demo
 * Demonstrates the importance of color contrast for readability
 */
function initContrastDemo() {
  const contrastDemo = document.getElementById('contrast-demo');
  if (!contrastDemo) return;
  
  const badContrastText = document.getElementById('bad-contrast-text');
  const goodContrastText = document.getElementById('good-contrast-text');
  const contrastSlider = document.getElementById('contrast-slider');
  
  if (!badContrastText || !goodContrastText || !contrastSlider) return;
  
  // Update text contrast based on slider value
  contrastSlider.addEventListener('input', function() {
    const sliderValue = this.value;
    
    // Update bad contrast example (low contrast)
    const badTextColor = `rgba(120, 120, 120, ${1 - sliderValue/100})`;
    badContrastText.style.color = badTextColor;
    
    // Update good contrast example (high contrast)
    const goodTextColor = `rgba(0, 0, 0, ${sliderValue/100})`;
    goodContrastText.style.color = goodTextColor;
    
    // Announce changes for screen readers
    const sliderAnnounce = document.getElementById('contrast-slider-announce');
    if (sliderAnnounce) {
      sliderAnnounce.textContent = `Contraste ajustado para ${sliderValue}%`;
    }
  });
  
  // Initialize with current slider value
  contrastSlider.dispatchEvent(new Event('input'));
}

/**
 * Keyboard Trap Demo
 * Demonstrates the issue of keyboard traps and how to avoid them
 */
function initKeyboardTrapDemo() {
  const trapDemo = document.getElementById('keyboard-trap-demo');
  if (!trapDemo) return;
  
  const badTrapContainer = document.getElementById('bad-keyboard-trap');
  const escapeTrapButton = document.getElementById('escape-trap-button');
  const trapInput1 = document.getElementById('trap-input-1');
  const trapInput2 = document.getElementById('trap-input-2');
  const trapInput3 = document.getElementById('trap-input-3');
  
  if (!badTrapContainer || !escapeTrapButton) return;
  
  // Set up the trap in the bad example
  if (trapInput1 && trapInput2 && trapInput3) {
    trapInput1.addEventListener('keydown', function(e) {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        trapInput2.focus();
      }
    });
    
    trapInput2.addEventListener('keydown', function(e) {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        trapInput3.focus();
      } else if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        trapInput1.focus();
      }
    });
    
    trapInput3.addEventListener('keydown', function(e) {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        trapInput1.focus();
      } else if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        trapInput2.focus();
      }
    });
  }
  
  // The escape button is the only way out of the trap
  escapeTrapButton.addEventListener('click', function() {
    // Exit the trap by focusing on an element outside the container
    document.getElementById('keyboard-trap-heading').focus();
    
    // Show a modal dialogue explaining what happened
    alert('Você escapou da armadilha de teclado! Em uma aplicação acessível, isso nunca deveria acontecer.');
  });
}

/**
 * Alt Text Demo
 * Shows the importance of alternative text for images
 */
function initAltTextDemo() {
  const altTextDemo = document.getElementById('alt-text-demo');
  if (!altTextDemo) return;
  
  const toggleImagesBtn = document.getElementById('toggle-images-btn');
  const imagesContainer = document.getElementById('alt-text-images');
  
  if (!toggleImagesBtn || !imagesContainer) return;
  
  toggleImagesBtn.addEventListener('click', function() {
    const imagesHidden = imagesContainer.classList.toggle('images-hidden');
    
    // Update all images
    const images = imagesContainer.querySelectorAll('img');
    images.forEach(img => {
      if (imagesHidden) {
        // Store original dimensions
        img.dataset.originalWidth = img.offsetWidth;
        img.dataset.originalHeight = img.offsetHeight;
        
        // Hide image visually but keep its space
        img.style.opacity = '0';
        
        // Add alt text visually on top of the image
        const altTextOverlay = document.createElement('div');
        altTextOverlay.className = 'alt-text-overlay';
        altTextOverlay.textContent = img.alt || '(Sem texto alternativo!)';
        img.parentNode.insertBefore(altTextOverlay, img.nextSibling);
      } else {
        // Show images again
        img.style.opacity = '1';
        
        // Remove alt text overlays
        const overlay = img.nextSibling;
        if (overlay && overlay.className === 'alt-text-overlay') {
          overlay.parentNode.removeChild(overlay);
        }
      }
    });
    
    // Update button text
    this.textContent = imagesHidden ? 'Mostrar imagens' : 'Esconder imagens (mostrar texto alternativo)';
    this.setAttribute('aria-pressed', imagesHidden);
  });
}

/**
 * ARIA Demo
 * Demonstrates the use of ARIA attributes
 */
function initAriaDemo() {
  const ariaDemo = document.getElementById('aria-demo');
  if (!ariaDemo) return;
  
  // Set up the tabs example
  const tabList = document.querySelector('[role="tablist"]');
  if (!tabList) return;
  
  const tabs = tabList.querySelectorAll('[role="tab"]');
  const tabPanels = document.querySelectorAll('[role="tabpanel"]');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Deactivate all tabs
      tabs.forEach(t => {
        t.setAttribute('aria-selected', 'false');
        t.tabIndex = -1;
      });
      
      // Hide all tab panels
      tabPanels.forEach(panel => {
        panel.hidden = true;
      });
      
      // Activate current tab
      this.setAttribute('aria-selected', 'true');
      this.tabIndex = 0;
      
      // Show current tab panel
      const panelId = this.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.hidden = false;
      }
    });
    
    // Handle keyboard navigation
    tab.addEventListener('keydown', function(e) {
      let targetTab = null;
      
      // Left/Right arrow keys for horizontal navigation
      if (e.key === 'ArrowRight') {
        targetTab = this.nextElementSibling;
        if (!targetTab) {
          // Loop back to first tab
          targetTab = tabs[0];
        }
      } else if (e.key === 'ArrowLeft') {
        targetTab = this.previousElementSibling;
        if (!targetTab) {
          // Loop to last tab
          targetTab = tabs[tabs.length - 1];
        }
      }
      
      if (targetTab) {
        e.preventDefault();
        targetTab.click();
        targetTab.focus();
      }
    });
  });
  
  // Initialize by selecting the first tab
  if (tabs.length > 0) {
    tabs[0].click();
  }
}

/**
 * Semantic Structure Demo
 * Shows the importance of proper HTML structure
 */
function initSemanticStructureDemo() {
  const structureDemo = document.getElementById('semantic-structure-demo');
  if (!structureDemo) return;
  
  const toggleStructureBtn = document.getElementById('toggle-structure-btn');
  const badStructure = document.getElementById('bad-structure');
  const goodStructure = document.getElementById('good-structure');
  
  if (!toggleStructureBtn || !badStructure || !goodStructure) return;
  
  toggleStructureBtn.addEventListener('click', function() {
    const showStructure = this.getAttribute('aria-pressed') !== 'true';
    
    // Toggle the visualization of the structure
    if (showStructure) {
      // Highlight the structure
      badStructure.classList.add('show-structure');
      goodStructure.classList.add('show-structure');
      
      // Add structure annotations
      annotateStructure(badStructure);
      annotateStructure(goodStructure);
    } else {
      // Remove highlighting
      badStructure.classList.remove('show-structure');
      goodStructure.classList.remove('show-structure');
      
      // Remove annotations
      removeAnnotations(badStructure);
      removeAnnotations(goodStructure);
    }
    
    // Update button state
    this.setAttribute('aria-pressed', showStructure);
    this.textContent = showStructure ? 'Esconder estrutura semântica' : 'Mostrar estrutura semântica';
  });
  
  function annotateStructure(container) {
    // Remove existing annotations first
    removeAnnotations(container);
    
    // Get all elements within the container
    const elements = container.querySelectorAll('*');
    
    elements.forEach(el => {
      // Only annotate semantic elements
      const semanticTags = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'figure', 'figcaption'];
      const isDiv = el.tagName.toLowerCase() === 'div';
      const hasRole = el.hasAttribute('role');
      
      if (semanticTags.includes(el.tagName.toLowerCase()) || (isDiv && hasRole)) {
        // Create tag annotation
        const tagLabel = document.createElement('span');
        tagLabel.className = 'structure-tag';
        
        if (isDiv && hasRole) {
          tagLabel.textContent = `<div role="${el.getAttribute('role')}">`;
        } else {
          tagLabel.textContent = `<${el.tagName.toLowerCase()}>`;
        }
        
        // Insert before element
        el.parentNode.insertBefore(tagLabel, el);
        
        // Create closing tag
        const closeTag = document.createElement('span');
        closeTag.className = 'structure-tag closing';
        
        if (isDiv && hasRole) {
          closeTag.textContent = '</div>';
        } else {
          closeTag.textContent = `</${el.tagName.toLowerCase()}>`;
        }
        
        // Insert after element
        if (el.nextSibling) {
          el.parentNode.insertBefore(closeTag, el.nextSibling);
        } else {
          el.parentNode.appendChild(closeTag);
        }
      }
    });
  }
  
  function removeAnnotations(container) {
    // Remove all annotation tags
    const annotations = container.querySelectorAll('.structure-tag');
    annotations.forEach(annotation => {
      annotation.parentNode.removeChild(annotation);
    });
  }
}

/**
 * Error Message Demo
 * Shows accessible vs. inaccessible error messages
 */
function initErrorMessageDemo() {
  const errorDemo = document.getElementById('error-message-demo');
  if (!errorDemo) return;
  
  const badForm = document.getElementById('bad-error-form');
  const goodForm = document.getElementById('good-error-form');
  
  // Set up bad form example (inaccessible)
  if (badForm) {
    badForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get input
      const badInput = document.getElementById('bad-error-input');
      
      // Clear previous error
      const previousError = badForm.querySelector('.error-message');
      if (previousError) {
        previousError.parentNode.removeChild(previousError);
      }
      
      // Validate (just check if empty for demo)
      if (!badInput.value.trim()) {
        // Add error message without proper accessibility
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.style.color = 'red';
        errorMsg.textContent = 'Este campo é obrigatório!';
        
        // Insert after input
        badInput.parentNode.insertBefore(errorMsg, badInput.nextSibling);
        
        // Change border color without explanation
        badInput.style.borderColor = 'red';
      }
    });
  }
  
  // Set up good form example (accessible)
  if (goodForm) {
    goodForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get input
      const goodInput = document.getElementById('good-error-input');
      const errorContainer = document.getElementById('good-error-message');
      
      // Validate (just check if empty for demo)
      if (!goodInput.value.trim()) {
        // Update error message with proper accessibility
        errorContainer.textContent = 'Este campo é obrigatório. Por favor, preencha-o.';
        errorContainer.classList.remove('visually-hidden');
        
        // Update input attributes
        goodInput.setAttribute('aria-invalid', 'true');
        goodInput.setAttribute('aria-describedby', 'good-error-message');
        
        // Add error class for styling
        goodInput.classList.add('form-error-border');
        
        // Focus the input for attention
        goodInput.focus();
      } else {
        // Clear error state
        errorContainer.textContent = '';
        errorContainer.classList.add('visually-hidden');
        goodInput.removeAttribute('aria-invalid');
        goodInput.classList.remove('form-error-border');
        
        // Show success message
        alert('Formulário enviado com sucesso!');
      }
    });
  }
}
