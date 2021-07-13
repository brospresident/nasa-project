const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://nasa-admin:U4ySuK46AMLtOAeV@cluster0.kr512.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
    console.log('MongoDB connected!');
});

mongoose.connection.on('error', (error) => {
    console.log(error);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL, {
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true
    });
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}
