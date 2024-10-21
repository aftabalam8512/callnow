// Variables to hold user input
let zipCode = '';
let birthDate = '';
let insuranceStatus = '';
let selectedCompany = '';

// ZIP Code Validation and Proceed
document.getElementById('zipCodeInput').addEventListener('input', function (event) {
  // Remove any non-numeric characters
  let input = event.target.value.replace(/\D/g, '');

  // Ensure the length doesn't exceed 5 digits
  if (input.length > 5) {
    input = input.slice(0, 5);  // Trim the input to 5 digits
  }

  // Update the input value with the filtered numeric input
  event.target.value = input;
});

document.getElementById('zipContinue').addEventListener('click', function () {
  const input = document.getElementById('zipCodeInput').value;
  if (input.length === 5 && /^\d{5}$/.test(input)) {
    zipCode = input;
    showStep(2);  // Move to birthdate selection step
  } else {
    alert("Please enter a valid 5-digit ZIP code");
  }
});

// Birthdate Validation and Proceed
document.getElementById('birthDateContinue').addEventListener('click', function () {
  const birthDateInput = document.getElementById('birthDateInput').value;
  if (birthDateInput) {
    birthDate = birthDateInput;
    showStep(3);  // Move to the insurance selection step
  } else {
    alert("Please select your birth date");
  }
});

// Show the next step with fade effect
function showStep(step) {
  const currentStep = document.querySelector('.step:not(.hidden)');  // Find the currently visible step
  if (currentStep) {
    currentStep.classList.add('hidden');  // Hide the current step
  }
  const nextStep = document.getElementById(`step${step}`);  // Find the next step
  if (nextStep) {
    nextStep.classList.remove('hidden');  // Show the next step
  }
}

// Final Display and Age Calculation (unchanged)
function displayResults() {
  const age = calculateAge(new Date(birthDate));

  document.getElementById('displayZip').textContent = zipCode;
  document.getElementById('displayBirthdate').textContent = birthDate; // Display in YYYY-MM-DD
  document.getElementById('displayAge').textContent = age;

  // Update URL with the data
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('zipcode', zipCode);
  currentUrl.searchParams.set('birth_date', birthDate); // Update to include birthdate
  currentUrl.searchParams.set('age', age);

  // Update insurance status in URL
  if (insuranceStatus === 'no') {
    currentUrl.searchParams.set('is_insured', 'UNKNOWN');
  } else if (insuranceStatus === 'yes' && selectedCompany) {
    currentUrl.searchParams.set('is_insured', 'OTHER');
    currentUrl.searchParams.set('insurance_company', selectedCompany); // Add selected insurance company
  }

  window.history.pushState({}, '', currentUrl); // Update the URL without refreshing the page
}

// Function to Calculate Age
function calculateAge(birthdate) {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}



// Function to load the Ringba script
function loadRingbaScript() {
  const script = document.createElement('script');
  script.src = "//b-js.ringba.com/CAf48475b102d441f384fa42a37d53e56a";
  script.async = true;
  document.body.appendChild(script);
}

// Function to move to the next step with fade effect
function showStep(step) {
  const currentStep = document.querySelector('.step:not(.hidden)'); // Find the currently visible step
  if (currentStep) {
    currentStep.classList.remove('in'); // Start fading out
    setTimeout(() => {
      currentStep.classList.add('hidden'); // Hide after fading out
      const nextStep = document.getElementById(`step${step}`);
      nextStep.classList.remove('hidden'); // Show the next step
      nextStep.classList.add('fade', 'in'); // Start fading in
    }, 500); // Match this timeout with the CSS transition duration
  } else {
    const nextStep = document.getElementById(`step${step}`);
    nextStep.classList.remove('hidden'); // Show the next step for the first time
    nextStep.classList.add('fade', 'in'); // Start fading in
  }
}

$(document).ready(function () {

  var timeoutHandle;

  function countdown(minutes, seconds) {
    function tick() {
      document.getElementById("timer").style.color = 'red';
      document.getElementById("timer").style.fontWeight = "bold";
      document.getElementById("timer").style.fontSize = "large";
      var counter = document.getElementById("timer");

      counter.innerHTML = minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
      seconds--;
      if (seconds >= 0) {
        timeoutHandle = setTimeout(tick, 1000)
      } else {
        if (minutes >= 1) {
          setTimeout(function () {
            countdown(minutes - 1, 59)
          }, 1000)
        }
      }

    }
    tick();
  }

  $(".btn").click(function () {
    $(this).closest(".q").hide().next(".q").fadeIn();
  });

  // Handle Yes and No Buttons for Insurance Selection
$("#step3 .btn").click(function () {
  const selectedValue = $(this).attr("data-value");
  insuranceStatus = selectedValue; // Set the insurance status

  if (selectedValue === "no") {
      // Handle the 'No' insurance option
      displayResults();  // Update URL with 'no' insurance status
      $("#step3").slideUp(300);  // Hide Step 5
      setTimeout(function () {
          showLoaderAndProceed(); // Show loader and proceed to the next step
      }, 300); // Delay before showing Step 6

  } else if (selectedValue === "yes") {
    $(".insurance").hide();
    $("#insuranceCompanySelection").slideDown(300); // Show the insurance select field
  }
});

// Handle Insurance Company Selection (only if "Yes" is selected)
$("#insuranceCompany").change(function () {
  selectedCompany = $(this).val();  // Get the selected company
  insuranceStatus = 'yes';  // Set insurance status to 'yes'
  displayResults();  // Update URL with 'yes' insurance status and selected company
  $("#step3").slideUp(300);  // Hide Step 5
  showLoaderAndProceed();  // Show loader and proceed
});

// Function to handle loader and rotating text logic
function showLoaderAndProceed() {
  const messages = [
      "Processing...",
      "Confirming eligibility in your area...",
      "Generating your personalized quote...",
      "Searching for the best rates...",
      "Analyzing your eligibility for discounts...",
      "Securing spot with personal agent...",
      "Finding An Agent...",
      "Found Agent...",
      "1 Agent Available..."
  ];

  let currentIndex = 0;

  // Function to rotate the loader text
  function rotateText() {
      if (currentIndex < messages.length) {
          $("#loaderText").text(messages[currentIndex]);
          
          let delay = 1500; // Default delay for most messages

          // Apply a 3-second delay for specific messages
          if (messages[currentIndex] === "Finding An Agent...") {
              delay = 5000; // 3-second delay for these specific messages
          }
            // Apply a 3-second delay for specific messages
            if (messages[currentIndex] === "1 Agent Available...") {
              $(".loader").css('display', 'none'); // Hide the loader
              delay = 1000; // 3-second delay for these specific messages
          }

          currentIndex++;
          setTimeout(rotateText, delay); // Change text after the specified delay
      } else {
          // Once all messages are shown, hide loading and proceed
          setTimeout(function () {
              $("#loading").slideUp(300);  // Hide loader
              $("#step4").slideDown(300);  // Show next step
              countdown(1, 59);            // Start countdown if needed
              loadRingbaScript();          // Load additional script
          }, 1000); // Delay before proceeding
      }
  }
  $("#loading").slideDown(300); // Show loading animation
  rotateText(); // Start rotating messages
}
});