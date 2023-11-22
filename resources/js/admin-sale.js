window.addEventListener("load", () => {
    let setSaleButton = document.getElementById("set-sale-button");
    let deleteSaleButton = document.getElementById("delete-sale-button");
    let saleMessageInput = document.getElementById("sale-message-input");

    setSaleButton.addEventListener("click", () => {
        let saleMessage = saleMessageInput.value;
        
        // send a fetch request to set the sale message
        let response = fetch('/api/sale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: saleMessage }),
        })
        .then(response => {
            if (response.status === 200) {
                // sale message set successfully, clear input box
                saleMessageInput.value = '';
            } else {
                console.log('Failed to set sale message:');
            }
        });
    });

    deleteSaleButton.addEventListener("click", () => {
        // send a fetch request to delete the sale
        let saleMessage = "";

        let response = fetch('/api/sale', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: saleMessage }),
        })
        .then(response => {
            if (response.status === 200) {
                console.log('successfully deleted');
            } else {
                console.log('Failed to delete sale');
            }
        });
    });
});