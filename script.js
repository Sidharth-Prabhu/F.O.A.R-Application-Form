// script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('application-form');
    const formSteps = Array.from(document.querySelectorAll('.form-step'));
    const nextBtns = Array.from(document.querySelectorAll('.next-btn'));
    const prevBtns = Array.from(document.querySelectorAll('.prev-btn'));
    const adminSelect = document.querySelector('select[name="admin"]');
    const adminOtherInput = document.getElementById('admin_other');

    let currentStep = 0;

    // Show the first step
    formSteps[currentStep].classList.add('active');

    // Next button event
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Validate current step
            const currentFormStep = formSteps[currentStep];
            const inputs = currentFormStep.querySelectorAll('input, textarea, select');
            let valid = true;
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    valid = false;
                }
            });
            if (!valid) return;

            // Handle dynamic steps based on selected units
            if (currentStep === 7) { // After selecting units
                const units = Array.from(document.querySelectorAll('input[name="units"]:checked')).map(el => el.value);
                // Insert steps for skills based on units
                // Remove existing dynamic steps if any
                const dynamicSteps = form.querySelectorAll('.dynamic-step');
                dynamicSteps.forEach(step => step.remove());

                let insertIndex = 8; // After units step

                if (units.includes('Frissco Creative Labs')) {
                    const creativeStep = document.getElementById('creative-skills-step');
                    creativeStep.classList.add('dynamic-step');
                    form.insertBefore(creativeStep, formSteps[insertIndex]);
                    insertIndex++;
                }

                if (units.includes('Frissco Media Productions')) {
                    const mediaStep = document.getElementById('media-skills-step');
                    mediaStep.classList.add('dynamic-step');
                    form.insertBefore(mediaStep, formSteps[insertIndex]);
                    insertIndex++;
                }
            }

            // Move to next step
            formSteps[currentStep].classList.remove('active');
            currentStep++;
            if (currentStep >= formSteps.length) {
                currentStep = formSteps.length - 1;
            }
            formSteps[currentStep].classList.add('active');
        });
    });

    // Previous button event
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            formSteps[currentStep].classList.remove('active');
            currentStep--;
            if (currentStep < 0) {
                currentStep = 0;
            }
            formSteps[currentStep].classList.add('active');
        });
    });

    // Show 'Other' input for admin selection
    adminSelect.addEventListener('change', () => {
        if (adminSelect.value === 'Other') {
            adminOtherInput.classList.remove('hidden');
            adminOtherInput.setAttribute('required', 'required');
        } else {
            adminOtherInput.classList.add('hidden');
            adminOtherInput.removeAttribute('required');
            adminOtherInput.value = '';
        }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Collect form data
        const formData = new FormData(form);

        // Convert to JSON
        const data = {};
        formData.forEach((value, key) => {
            // Handle multiple selections
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        });

        // Send data via Fetch
        fetch(form.action, {
            method: form.method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show thank you message
                formSteps[currentStep].classList.remove('active');
                formSteps[formSteps.length - 1].classList.add('active');
            } else {
                alert('There was an error submitting the form. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting the form. Please try again.');
        });
    });
});

