/**
 * Accessible Form Validation
 * Implements client-side validation that's accessible to screen readers and keyboard users
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize validation for all forms with 'needs-validation' class
  const forms = document.querySelectorAll('form.needs-validation');
  
  if (forms.length === 0) return;
  
  forms.forEach(form => {
    // Add a container for live validation announcements
    const validationAnnounce = document.createElement('div');
    validationAnnounce.className = 'sr-only';
    validationAnnounce.setAttribute('aria-live', 'assertive');
    validationAnnounce.id = `${form.id}-validation-live`;
    form.appendChild(validationAnnounce);
    
    // Add custom validation for each input when it changes
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        validateInput(this);
      });
      
      input.addEventListener('blur', function() {
        validateInput(this, true);
      });
    });
    
    // Form submission validation
    form.addEventListener('submit', function(event) {
      // Prevent default submission initially
      event.preventDefault();
      
      // Array to collect validation messages
      const validationMessages = [];
      
      // Validate all inputs
      let formIsValid = true;
      inputs.forEach(input => {
        const isValid = validateInput(input, true);
        if (!isValid) {
          formIsValid = false;
          const label = form.querySelector(`label[for="${input.id}"]`);
          const labelText = label ? label.textContent : input.name;
          validationMessages.push(`${labelText} inválido: ${input.validationMessage}`);
        }
      });
      
      // If the form is valid, submit it
      if (formIsValid) {
        form.submit();
      } else {
        // Announce validation errors to screen readers
        const validationSummary = `Formulário contém ${validationMessages.length} erro(s): ${validationMessages.join(', ')}`;
        document.getElementById(`${form.id}-validation-live`).textContent = validationSummary;
        
        // Focus the first invalid field
        const firstInvalid = form.querySelector('.form-error-border');
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    });
  });
});

/**
 * Validates a single input and updates its visual state
 * @param {HTMLElement} input - The input element to validate
 * @param {boolean} showError - Whether to show error messages
 * @returns {boolean} - Whether the input is valid
 */
function validateInput(input, showError = false) {
  // Skip validation for disabled or hidden fields
  if (input.disabled || input.type === 'hidden') {
    return true;
  }
  
  // Get related elements
  const form = input.closest('form');
  const errorContainer = form.querySelector(`#${input.id}-error`);
  
  // Check built-in validation
  const isValid = input.checkValidity();
  
  // Custom validation for specific input types
  let customValidationMessage = '';
  
  // Custom email validation with more helpful message
  if (input.type === 'email' && !isValid) {
    customValidationMessage = 'Por favor, digite um endereço de e-mail válido (exemplo: nome@dominio.com)';
  }
  
  // Custom password validation with more helpful message
  if (input.type === 'password' && input.minLength > 0 && input.value.length < input.minLength) {
    customValidationMessage = `A senha deve ter pelo menos ${input.minLength} caracteres`;
  }
  
  // Update visual state
  if (!isValid) {
    input.classList.add('form-error-border');
    
    // Only show error messages if requested (e.g., on blur or submit)
    if (showError && errorContainer) {
      errorContainer.textContent = customValidationMessage || input.validationMessage;
      errorContainer.classList.remove('visually-hidden');
      
      // Add aria-describedby to connect input with error message
      input.setAttribute('aria-describedby', `${input.id}-error`);
      
      // Add aria-invalid attribute
      input.setAttribute('aria-invalid', 'true');
    }
  } else {
    // Clear error state
    input.classList.remove('form-error-border');
    
    if (errorContainer) {
      errorContainer.textContent = '';
      errorContainer.classList.add('visually-hidden');
      
      // Remove aria-describedby and aria-invalid
      input.removeAttribute('aria-describedby');
      input.setAttribute('aria-invalid', 'false');
    }
  }
  
  return isValid;
}

/**
 * Sets up the character counter for textarea elements
 */
function initCharacterCounters() {
  const textareas = document.querySelectorAll('textarea[maxlength]');
  
  textareas.forEach(textarea => {
    const maxLength = textarea.getAttribute('maxlength');
    
    // Create counter element
    const counter = document.createElement('div');
    counter.className = 'form-hint';
    counter.id = `${textarea.id}-counter`;
    counter.setAttribute('aria-live', 'polite');
    counter.textContent = `0/${maxLength} caracteres`;
    
    // Insert counter after textarea
    textarea.parentNode.insertBefore(counter, textarea.nextSibling);
    
    // Update counter on input
    textarea.addEventListener('input', function() {
      const remainingChars = maxLength - this.value.length;
      const used = this.value.length;
      counter.textContent = `${used}/${maxLength} caracteres`;
      
      // Change color when approaching limit
      if (remainingChars <= 10) {
        counter.style.color = 'var(--color-warning)';
      } else {
        counter.style.color = 'var(--color-text-light)';
      }
    });
  });
}

// Initialize character counters when DOM is ready
document.addEventListener('DOMContentLoaded', initCharacterCounters);
