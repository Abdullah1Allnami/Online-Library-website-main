function showPaymentDetails(type, number, owner) {
    document.getElementById("paymentPopup").style.display = "block";
    document.getElementById("paymentPopupContent").innerHTML = `
      <div>
        <strong>Type:</strong> ${type}
      </div>
      <div>
        <strong>Number:</strong> ${number}
      </div>
      <div>
        <strong>Owner:</strong> ${owner}
      </div>
      <button onclick="editPayment('${type}', '${number}', '${owner}')">Edit</button>
      <button onclick="deletePayment('${type}', '${number}', '${owner}')">Delete</button>
    `;
  }

  function editPayment(type, number, owner) {
    // Add functionality to edit the payment method here
  }

  function deletePayment(type, number, owner) {
    // Add functionality to delete the payment method here
  }