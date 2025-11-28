// Validation helper functions
const validatePhoneNumber = (phone) => {
    // Indian phone number validation (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateDateOfBirth = (dob) => {
    const date = new Date(dob);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();

    // Must be between 13 and 120 years old
    return age >= 13 && age <= 120;
};

const validateGender = (gender) => {
    return ['Male', 'Female', 'Other'].includes(gender);
};

module.exports = {
    validatePhoneNumber,
    validateEmail,
    validateDateOfBirth,
    validateGender,
};
