// get references to the elements
const scholarshipSelect = document.getElementById("scholarship");
const subscribeCheckbox = document.getElementById("subscribe");
const priceLabel = document.getElementById("priceLabel");

// add event listeners for the input event
scholarshipSelect.addEventListener("input", updatePrice);
subscribeCheckbox.addEventListener("input", updatePrice);

// update the calculated price
function updatePrice() {
    // get the selected scholarship option's value
    const selectedOptionValue = parseFloat(scholarshipSelect.value);

    // check if the checkbox is checked
    const isSubscribed = subscribeCheckbox.checked;

    // calculate the price with or without the 10% increase
    let price = selectedOptionValue;
    if (isSubscribed) {
        price *= 1.10; // Apply a 10% increase
    }

    // ppdate the label text with the calculated price
    priceLabel.textContent = price.toFixed(2); // Display the price with 2 decimal places
}

// initially, call the updatePrice function to calculate the initial price based on the default values
updatePrice();