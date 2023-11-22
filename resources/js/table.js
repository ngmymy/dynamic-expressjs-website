function deleteRow(r) {
    // find parent <tr> 
    let row = r.closest('tr');
    // extract the contact ID from the data attribute
    let contactId = row.getAttribute('id');

    // send a DELETE request to the server
    let response = fetch('/api/contact', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: contactId })
    })
    .then(response => {
        if (response.status === 200) {
            // if the contact was deleted on the server or not found, remove the row
            row.remove();
        }
    })
}

function addTimeUntil() {
    // gets date from id="date-cell"
    const dateCells = document.querySelectorAll('.date-cell');

    // applying to each row
    dateCells.forEach(cell => {
        let dateText = cell.textContent;
        let timeUntilCell = cell.nextElementSibling;
        
        let targetDate = new Date(dateText);
        
        // Data.parse("string")
        if (!isNaN(targetDate)) {
            const now = new Date(); // today
            const timeDifference = targetDate - now;
            
            if (timeDifference > 0) {
                const seconds = Math.floor((timeDifference / 1000) % 60);
                const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
                const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                
                timeUntilCell.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s left`;
            } else {
                timeUntilCell.textContent = "PAST";
            }
        }
    });
}

// Update the time until every second
setInterval(addTimeUntil, 1000);

// Initial call to set up time until on page load
addTimeUntil();