const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return;
    try {
        this.password = await argon2.hash(this.password);
        next();
    } catch {
        next(err);;
    }
});

module.exports = mongoose.model('User', userSchema);