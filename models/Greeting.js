const mongoose = require('mongoose');

// מגדירים איך תיראה ברכה במסד הנתונים
const greetingSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['general', 'anniversary', 'birthday', 'love'] // מוודא שאפשר להכניס רק את הקטגוריות האלה
    },
    createdAt: {
        type: Date,
        default: Date.now // שומר אוטומטית את התאריך שבו הברכה נכתבה
    }
});

module.exports = mongoose.model('Greeting', greetingSchema);