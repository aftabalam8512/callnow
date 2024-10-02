//generate Years buttons
  // Function to create year buttons from 2010 to 1970
//generate Years buttons
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


//generate Months buttons 
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
        // Create button element
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'col-6 col-md-4 col-lg-3 grid-item';
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary grid-button month-button';
        button.textContent = month.name;
        button.setAttribute('data-value', month.value);

        // Append button to the div, and div to the container
        buttonDiv.appendChild(button);
        container.appendChild(buttonDiv);
    });
}

// Call the function to create buttons on page load or at the appropriate time
createMonthButtons();



//generate Days buttons 
// Function to create day buttons from 1 to 31
function createDayButtons() {
  const container = document.getElementById('dayButtonsContainer');
  container.innerHTML = ''; // Clear any existing buttons

  for (let day = 1; day <= 31; day++) {
      // Create button element
      const buttonDiv = document.createElement('div');
      buttonDiv.className = 'col-6 col-md-4 col-lg-2 grid-item';
      const button = document.createElement('button');
      button.className = 'btn btn-outline-primary grid-button day-button';
      button.textContent = day;

      // Append button to the div, and div to the container
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

// Year Selection
document.querySelectorAll('.year-button').forEach(button => {
  button.addEventListener('click', function() {
    birthYear = this.textContent;
    showStep(3);  // Move to month selection
  });
});

// Month Selection
document.querySelectorAll('.month-button').forEach(button => {
  button.addEventListener('click', function() {
    birthMonth = this.getAttribute('data-value');
    showStep(4);  // Move to day selection
  });
});

// Day Selection
document.querySelectorAll('.day-button').forEach(button => {
  button.addEventListener('click', function() {
    birthDay = this.textContent;
    showStep(5);  // Move to insurance selection
  });
});

// Insurance Selection
document.querySelectorAll('.insured-button').forEach(button => {
  button.addEventListener('click', function() {
    insuranceStatus = this.getAttribute('data-value');
    showStep(6);  // Move to final step
    displayResults();  // Display results
  });
});

// Final Display and Age Calculation
function displayResults() {
  const birthdate = new Date(`${birthYear}-${birthMonth}-${birthDay}`);
  const age = calculateAge(birthdate);

  document.getElementById('displayZip').textContent = zipCode;
  document.getElementById('displayBirthdate').textContent = `${birthYear}-${birthMonth}-${birthDay}`;
  document.getElementById('displayAge').textContent = age;

  // Update URL with the data
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('zipcode', zipCode);
  currentUrl.searchParams.set('year', birthYear);
  currentUrl.searchParams.set('month', birthMonth);
  currentUrl.searchParams.set('day', birthDay);
  currentUrl.searchParams.set('age', age);
  currentUrl.searchParams.set('insurance', insuranceStatus);
  window.history.pushState({}, '', currentUrl);
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

// Move to next step function with fade effect
function showStep(step) {
  const currentStep = document.querySelector('.step:not(.hidden)'); // Find the currently visible step
  if (currentStep) {
    currentStep.classList.remove('in'); // Start fading out
    setTimeout(() => {
      currentStep.classList.add('hidden'); // Hide after fading out
      const nextStep = document.getElementById(`step${step}`);
      nextStep.classList.remove('hidden'); // Show the next step
      nextStep.classList.add('fade', 'in'); // Start fading in

      // Load the Ringba script when showing step 6 (Congratulations)
      if (step === 6) {
        loadRingbaScript();  // Load the script only at step 6
      }
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

    $("#step5 .btn").click(function () {
        $("#loading").slideDown(300); // Show loading animation
        $("#step5").slideUp(300); // Hide Step 4
    
        setTimeout(function () {
            $("#loading").slideUp(300); // Hide loading animation
            $("#step6").slideDown(300); // Show Step 5
            countdown(1, 59); // Start countdown if needed
        }, 3000); // Delay before showing Step 5
    });
    
});