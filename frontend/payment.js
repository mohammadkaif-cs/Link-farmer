document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').id;
    const message = document.getElementById('payment-message');

    // Simulate payment processing logic
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('card-number').value;
        const cardholderName = document.getElementById('cardholder-name').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;

        // Validate and process card payment here...
        message.textContent = 'Card payment successful!';
    } else if (paymentMethod === 'upi') {
        const upiId = document.getElementById('upi-id').value;
        // Validate and process UPI payment here...
        message.textContent = 'UPI payment successful!';
    } else {
        // Cash on Delivery logic
        message.textContent = 'Order placed successfully! Pay upon delivery.';
    }
});

// Handle payment method switching
document.querySelectorAll('input[name="payment-method"]').forEach((elem) => {
    elem.addEventListener('change', function() {
        const cardDetails = document.getElementById('card-details');
        const upiDetails = document.getElementById('upi-details');

        if (this.id === 'card') {
            cardDetails.style.display = 'block';
            upiDetails.style.display = 'none';
        } else if (this.id === 'upi') {
            cardDetails.style.display = 'none';
            upiDetails.style.display = 'block';
        } else {
            cardDetails.style.display = 'none';
            upiDetails.style.display = 'none';
        }
    });
});
