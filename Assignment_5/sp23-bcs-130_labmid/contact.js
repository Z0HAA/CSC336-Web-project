document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  
  // Validation regex patterns
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidName = name => /^[A-Za-z\s\-]+$/.test(name.trim()) && name.trim().length >= 2;
  
  // Field validation function
  const validateField = (input, errorMsg, validationFn) => {
    const errorSpan = document.getElementById(input.id + "Error");
    
    if (!validationFn(input.value)) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      if (errorSpan) {
        errorSpan.textContent = errorMsg;
      }
      return false;
    } else {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
      if (errorSpan) {
        errorSpan.textContent = "";
      }
      return true;
    }
  };
  
  // Validate all fields
  const validateAllFields = () => {
    const nameValid = validateField(
      document.getElementById("contactName"),
      "Name required & letters only",
      v => v.trim() !== "" && isValidName(v)
    );
    
    const emailValid = validateField(
      document.getElementById("contactEmail"),
      "Valid email required",
      v => isValidEmail(v)
    );
    
    const subjectValid = validateField(
      document.getElementById("contactSubject"),
      "Subject required (min 3 characters)",
      v => v.trim().length >= 3
    );
    
    const messageValid = validateField(
      document.getElementById("contactMessage"),
      "Message required (min 10 characters)",
      v => v.trim().length >= 10
    );
    
    return nameValid && emailValid && subjectValid && messageValid;
  };
  
  // Real-time validation on input
  const formInputs = document.querySelectorAll("#contactForm .form-control");
  formInputs.forEach(input => {
    // Validate while typing (immediate feedback)
    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        validateAllFields();
      }
    });
    
    // Also validate on blur (when user leaves the field)
    input.addEventListener("blur", () => {
      validateAllFields();
    });
  });
  
  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const isValid = validateAllFields();
    
    if (isValid) {
      const btn = document.getElementById("sendMessageBtn");
      btn.disabled = true;
      btn.textContent = "Sending...";
      
      // Simulate sending (replace with actual form submission)
      setTimeout(() => {
        alert("Message sent successfully!");
        form.reset();
        
        // Remove all validation classes
        formInputs.forEach(input => {
          input.classList.remove("is-valid", "is-invalid");
        });
        
        // Clear all error messages
        document.querySelectorAll(".error-message").forEach(span => {
          span.textContent = "";
        });
        
        btn.disabled = false;
        btn.textContent = "Send a message";
      }, 1500);
    } else {
      // Focus on first invalid field
      const firstInvalid = document.querySelector("#contactForm .is-invalid");
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });
});