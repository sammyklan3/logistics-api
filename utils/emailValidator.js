function validateEmail(email) {
    // Regular expression pattern for validating email
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Test the email against the regex pattern
    return regex.test(email);
}

module.exports = validateEmail;