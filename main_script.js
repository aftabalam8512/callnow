// Variables to hold user input
let zipCode = '';
let birthYear = '';
let birthMonth = '';
let birthDay = '';
let insuranceStatus = '';
let selectedCompany = ''; // To hold the insurance company when 'yes' is selected
let selectedCountry = ''; // Assuming you have a variable for country selection


// Function to create year buttons from 1950 to 2000
function createYearButtons() {
  const container = document.getElementById('yearButtonsContainer');
  container.innerHTML = ''; // Clear any existing buttons

  for (let year = 1950; year <= 2000; year++) {  // Change the range from 1950 to 2000
      const buttonDiv = document.createElement('div');
      buttonDiv.className = 'col-6 col-md-4 col-lg-2 grid-item'; // Adjust for responsive grid
      const button = document.createElement('button');
      button.className = 'btn btn-outline-primary grid-button year-button';
      button.textContent = year;

      buttonDiv.appendChild(button);
      container.appendChild(buttonDiv);
  }
}

// Call the function to create buttons on page load or at the appropriate time
createYearButtons();

// Function to create month buttons from January to December
function createMonthButtons() {
    const container = document.getElementById('monthButtonsContainer');
    container.innerHTML = ''; // Clear any existing buttons

    const months = [
        { name: 'January', value: 1 },
        { name: 'February', value: 2 },
        { name: 'March', value: 3 },
        { name: 'April', value: 4 },
        { name: 'May', value: 5 },
        { name: 'June', value: 6 },
        { name: 'July', value: 7 },
        { name: 'August', value: 8 },
        { name: 'September', value: 9 },
        { name: 'October', value: 10 },
        { name: 'November', value: 11 },
        { name: 'December', value: 12 },
    ];

    months.forEach(month => {
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'col-6 col-md-4 col-lg-3 grid-item';
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary grid-button month-button';
        button.textContent = month.name;
        button.setAttribute('data-value', month.value);

        buttonDiv.appendChild(button);
        container.appendChild(buttonDiv);
    });
}

// Call the function to create buttons on page load or at the appropriate time
createMonthButtons();

// Function to create day buttons from 1 to 31
function createDayButtons() {
  const container = document.getElementById('dayButtonsContainer');
  container.innerHTML = ''; // Clear any existing buttons

  for (let day = 1; day <= 31; day++) {
      const buttonDiv = document.createElement('div');
      buttonDiv.className = 'col-6 col-md-4 col-lg-2 grid-item';
      const button = document.createElement('button');
      button.className = 'btn btn-outline-primary grid-button day-button';
      button.textContent = day;

      buttonDiv.appendChild(button);
      container.appendChild(buttonDiv);
  }
}

// Call the function to create buttons on page load or at the appropriate time
createDayButtons();


// ZIP Code Validation and Proceed
document.getElementById('zipContinue').addEventListener('click', function() {
  const input = document.getElementById('zipCodeInput').value;
  if (input.length === 5 && /^\d{5}$/.test(input)) {
    zipCode = input;
    showStep(2);  // Move to year selection
  } else {
    alert("Please enter a valid 5-digit ZIP code");
  }
});

// Bind event listeners to year, month, and day buttons dynamically after they are created
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('year-button')) {
        birthYear = event.target.textContent;
        showStep(3);  // Move to month selection
    }

    if (event.target.classList.contains('month-button')) {
        birthMonth = event.target.getAttribute('data-value');
        showStep(4);  // Move to day selection
    }

    if (event.target.classList.contains('day-button')) {
        birthDay = event.target.textContent;
        showStep(5);  // Move to insurance selection
    }
});

// Final Display and Age Calculation
function displayResults() {
  // Format the birthdate in YYYY-MM-DD format
  const formattedMonth = String(birthMonth).padStart(2, '0'); // Ensure month is two digits
  const formattedDay = String(birthDay).padStart(2, '0'); // Ensure day is two digits
  const birthdate = `${birthYear}-${formattedMonth}-${formattedDay}`;
  const age = calculateAge(new Date(birthdate));

  document.getElementById('displayZip').textContent = zipCode;
  document.getElementById('displayBirthdate').textContent = birthdate; // Display in YYYY-MM-DD
  document.getElementById('displayAge').textContent = age;

  // Update URL with the data
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('zipcode', zipCode);
  currentUrl.searchParams.set('birth_date', birthdate); // Update to include birthdate
  currentUrl.searchParams.set('age', age);

  // Update insurance status in URL
  if (insuranceStatus === 'no') {
    currentUrl.searchParams.set('is_insured', 'Unknown');
  } else if (insuranceStatus === 'yes' && selectedCompany) {
    currentUrl.searchParams.set('is_insured', 'other');
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

// Handle Yes and No Buttons for Insurance Selection
$("#step5 .btn").click(function () {
  const selectedValue = $(this).attr("data-value");
  insuranceStatus = selectedValue; // Set the insurance status

  if (selectedValue === "no") {
    displayResults(); // Update URL with 'no' insurance status
    $("#loading").slideDown(300); // Show loading animation
    $("#step5").slideUp(300); // Hide Step 5

    setTimeout(function () {
      $("#loading").slideUp(300); // Hide loading animation
      $("#step6").slideDown(300); // Show Step 6
      countdown(1, 59); // Start countdown if needed
      loadRingbaScript(); // Load Ringba script after loading animation ends
    }, 3000); // Delay before showing Step 6

  } else if (selectedValue === "yes") {
    $(".insurance").hide();
    $("#insuranceCompanySelection").slideDown(300); // Show the insurance select field
  }
});

// Handle Insurance Company Selection (only if "Yes" is selected)
$("#insuranceCompany").change(function () {
  selectedCompany = $(this).val();
  insuranceStatus = 'yes'; // Set insurance status to yes
  displayResults(); // Update URL with 'yes' insurance status and company

  $("#loading").slideDown(300); // Show loading animation
  $("#step5").slideUp(300); // Hide Step 5

  setTimeout(function () {
      $("#loading").slideUp(300); // Hide loading animation
      $("#step6").slideDown(300); // Show Step 6
      countdown(1, 59); // Start countdown if needed
      loadRingbaScript(); // Load Ringba script after loading animation ends
  }, 3000); // Delay before showing Step 6
});

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
$("#step5 .btn").click(function () {
  const selectedValue = $(this).attr("data-value");

  // Set the insurance status
  insuranceStatus = selectedValue;

  // Check if the user selected "No"
  if (selectedValue === "no") {
      // Send both "no" selection and insurance status
      displayResults(); // Update URL with 'no' insurance status
      
      // Move directly to the next step if "No" is selected
      $("#loading").slideDown(300); // Show loading animation
      $("#step5").slideUp(300); // Hide Step 5

      setTimeout(function () {
          $("#loading").slideUp(300); // Hide loading animation
          $("#step6").slideDown(300); // Show Step 6
          countdown(1, 59); // Start countdown if needed
          loadRingbaScript(); // Load Ringba script after loading animation ends
      }, 3000); // Delay before showing Step 6

  } else if (selectedValue === "yes") {
      // Show the insurance company select field for "Yes"
      $("#insuranceCompanySelection").slideDown(300); // Show the insurance select field
  }
});

// Handle Insurance Company Selection (only if "Yes" is selected)
$("#insuranceCompany").change(function () {
  const selectedCompany = $(this).val();
  insuranceStatus = selectedCompany; // Update the insurance status with the selected company

  // Send the selected insurance company along with 'yes' status
  displayResults(); // Update URL with 'yes' insurance status and company

  // Continue to the next step after selecting the insurance company
  $("#loading").slideDown(300); // Show loading animation
  $("#step5").slideUp(300); // Hide Step 5

  setTimeout(function () {
      $("#loading").slideUp(300); // Hide loading animation
      $("#step6").slideDown(300); // Show Step 6
      countdown(1, 59); // Start countdown if needed
      loadRingbaScript(); // Load Ringba script after loading animation ends
  }, 3000); // Delay before showing Step 6
});

  
    
});