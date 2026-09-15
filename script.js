const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const currentYear = document.getElementById("currentYear");

const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");

const phoneError = document.getElementById("phoneError");
const emailError = document.getElementById("emailError");

currentYear.textContent = new Date().getFullYear();

function showError(input, errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.add("is-visible");

  if (input.id === "phone") {
    input.closest(".phone-input").classList.add("is-invalid");
  } else {
    input.classList.add("is-invalid");
  }
}

function clearError(input, errorElement) {
  errorElement.textContent = "";
  errorElement.classList.remove("is-visible");

  if (input.id === "phone") {
    input.closest(".phone-input").classList.remove("is-invalid");
  } else {
    input.classList.remove("is-invalid");
  }
}

function validatePhone() {
  const digits = phoneInput.value.replace(/\D/g, "");

  if (!digits) {
    showError(phoneInput, phoneError, "გთხოვთ, მიუთითოთ ტელეფონის ნომერი.");

    return false;
  }

  if (digits.length < 9) {
    showError(
      phoneInput,
      phoneError,
      "ტელეფონის ნომერი უნდა შეიცავდეს მინიმუმ 9 ციფრს.",
    );

    return false;
  }

  clearError(phoneInput, phoneError);

  return true;
}

function validateEmail() {
  const email = emailInput.value.trim();

  // Email is optional
  if (!email) {
    clearError(emailInput, emailError);
    return true;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    showError(
      emailInput,
      emailError,
      "გთხოვთ, მიუთითოთ სწორი ელ. ფოსტის მისამართი.",
    );

    return false;
  }

  clearError(emailInput, emailError);

  return true;
}

// Only allow digits in the phone input
phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, "");

  if (phoneError.classList.contains("is-visible")) {
    validatePhone();
  }
});

emailInput.addEventListener("input", () => {
  if (emailError.classList.contains("is-visible")) {
    validateEmail();
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  formMessage.className = "form-message";
  formMessage.textContent = "";

  const isPhoneValid = validatePhone();
  const isEmailValid = validateEmail();

  if (!isPhoneValid || !isEmailValid) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');

  submitButton.disabled = true;
  submitButton.textContent = "იგზავნება...";

  const formData = new FormData(form);

  // Formspree receives the complete international number
  formData.set("phone", `+995${phoneInput.value}`);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    formMessage.textContent =
      "გმადლობთ! თქვენი ინფორმაცია მიღებულია. ჩვენი წარმომადგენელი მალე დაგიკავშირდებათ.";

    formMessage.classList.add("is-success");

    form.reset();

    clearError(phoneInput, phoneError);
    clearError(emailInput, emailError);
  } catch (error) {
    console.error(error);

    formMessage.textContent = "დაფიქსირდა შეცდომა. გთხოვთ, სცადოთ თავიდან.";

    formMessage.classList.add("is-error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "შეთავაზების მიღება";
  }
});
