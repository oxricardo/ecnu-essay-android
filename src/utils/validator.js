export default {
    validatePhone(phone) {
        const pattern = /^1[3-9]\d{9}$/;
        return pattern.test(phone);
      }
}