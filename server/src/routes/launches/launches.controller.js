const { getAllLaunches, scheduleNewLaunch, deleteLaunchWithId, existsLaunchWithId } = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
    let launch = req.body;

    if (!launch.launchDate || !launch.mission || !launch.target || !launch.rocket) {
        return res.status(400).json({
            error: 'One missing field.'
        });
    }

    launch.launchDate =  new Date(launch.launchDate);

    if (launch.launchDate.toString() === 'Invalid Date') {
        return res.status(400).json({
            error: 'Bad date'
        })
    }

    await scheduleNewLaunch(launch);

    return res.status(201).json(launch);
}

async function httpDeleteLaunch(req, res) {
    let id = +req.params.id;

    const aborted = await existsLaunchWithId(id)
    if (!aborted) {
        return res.status(404).json({
            error: 'Launch does not exist'
        });
    }

    const abort = await deleteLaunchWithId(id);

    if (!abort) return res.status(400).json({
        error: 'Launch not aborted'
    })

    return res.status(201).json({
        ok: true
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpDeleteLaunch
};