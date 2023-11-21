const sendMailTo = require('../../services/mail');
const {
    createAccessToken,
} = require('../../utils/jwt');
const {
    FRONTEND_URL,
} = require('../../../config');

async function activationEmail(user) {
    const token = await createAccessToken(user);
    const uid = Buffer.from(user._id).toString('base64');
    const subject = "Account activation";
    const html = `
        <h1>Hello</h1>
        <p>Thanks for registering!</p>
        <p>Please click the following link to activate your account:</p>
        <a href="${FRONTEND_URL}/auth/activate/${uid}/${token}">Activate</a>
    `;
    const res = sendMailTo(user.email, subject, html);
    if (res) {
        throw new Error("Activation email failed to send.");
    }
}

async function passwordResetEmail(user) {
    const token = await createAccessToken(user);
    const uid = Buffer.from(user._id).toString('base64');
    const subject = "Password reset";
    const html = `
        <h1>Hello</h1>
        <p>Forgot your password?</p>
        <p>Please click the following link to reset your password:</p>
        <a href="${FRONTEND_URL}/auth/reset-password/${uid}/${token}">Reset</a>
    `;
    const res = sendMailTo(user.email, subject, html);
    if (res) {
        throw new Error("Password reset email failed to send.");
    }
}

module.exports = {
    activationEmail,
    passwordResetEmail,
};
