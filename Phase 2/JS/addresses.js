function showAddressDetails(street, city, country) {
    document.getElementById("addressDetails").innerHTML = `
        <div>
        <strong>Street:</strong> ${street}
        </div>
        <div>
        <strong>City:</strong> ${city}
        </div>
        <div>
        <strong>Country:</strong> ${country}
        </div>
        <button onclick="editAddress('${street}', '${city}', '${country}')">Edit</button>
        <button onclick="deleteAddress('${street}', '${city}', '${country}')">Delete</button>
    `;
    }

    function editAddress(street, city, country) {
    // Add functionality to edit the address here
    }

    function deleteAddress(street, city, country) {
    // Add functionality to delete the address here
    }