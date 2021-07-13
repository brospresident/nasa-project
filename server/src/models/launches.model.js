const launchesMongo = require('./launches.mongo');
const planetsMongo = require('./planets.mongo');

const DEFAULT_LAUNCH_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: 'Keppler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('April 01, 2031'),
    target: 'Kepler-442 b',
    customers: ['NASA', 'Space X', 'Andrei Tech SRL'],
    upcoming: true,
    success: true
};

async function saveLaunch(launch) {
    const planet = await planetsMongo.findOne({
        keplerName: launch.target
    });

    if (!planet) {
        throw new Error('There is no planet with that name.');
    }

    await launchesMongo.findOneAndUpdate({
        flightNumber: launch.flightNumber
    },
    launch,
    {
        upsert: true
    });
}

saveLaunch(launch);

async function existsLaunchWithId(id) {
    return await launchesMongo.findOne({
        flightNumber: id
    });
}

async function getLatestFlightNumber() {
    const launch = await launchesMongo
        .findOne()
        .sort('-flightNumber');

    if (!launch) return DEFAULT_LAUNCH_NUMBER;

    return launch.flightNumber;
}

async function getAllLaunches() {
    return await launchesMongo.find({}, {
        '__id': 0,
        '__v': 0
    });
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = (await getLatestFlightNumber()) + 1;
    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        upcoming: true,
        success: true,
        customers: ['NASA', 'Space X']
    });

    await saveLaunch(newLaunch);
}

async function deleteLaunchWithId(id) {
    const res = await launchesMongo.updateOne({
        flightNumber: id
    }, {
        upcoming: false,
        success: false
    });

    return res.ok === 1 && res.nModified === 1;
}

module.exports = {
    getAllLaunches,
    existsLaunchWithId,
    deleteLaunchWithId,
    scheduleNewLaunch
};