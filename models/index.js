const mongoose = require('mongoose');

(async () => {
    try {
        await mongoose.connect(process.env.DB)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();