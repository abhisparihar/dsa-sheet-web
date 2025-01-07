const mongoose = require('mongoose');

(async () => {
    try {
        await mongoose.connect(process.env.DB)
        console.log(`Mongo db connect successfully.`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();