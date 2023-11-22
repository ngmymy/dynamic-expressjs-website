window.addEventListener("load", () => {
    let saleBanner = document.getElementById("sale-banner");

    async function updateSaleBanner() {
        // make a GET request to the /api/sale endpoint
        let response = await fetch('/api/sale', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (response.status === 200) {
            const data = await response.json();

            if (data.active && data.message) {
                // if there is an active sale, update the sale banner content
                saleBanner.textContent = data.message;
                saleBanner.style.display = "block"; // display the banner
            } else {
                saleBanner.style.display = "none"; // hide the banner when no sale is active
            }
        }
    }

    // update the sale banner every second
    setInterval(updateSaleBanner, 1000);

    // initial update on page load
    updateSaleBanner();
});
