const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo');

const isHabitable = (planet) => {
    return planet['koi_insol'] > 0.36
            && planet['koi_disposition'] === 'CONFIRMED'
            && planet['koi_insol'] < 1.11
            && planet['koi_prad'] < 1.6;
}

function loadPlanets() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) => {
                if (isHabitable(data)) {
                    savePlanet(data);
                }
            })
            .on('error', (error) => {
                reject(error);
            })
            .on('end', async () => {
                const foundPlanets = (await getAllPlanets()).length;
                console.log(`Found ${foundPlanets} habitable planets.`);
                resolve();
            });
    })
}

async function getAllPlanets() {
    return await planets.find({}, {
        '__id': 0,
        '__v': 0
    });
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        });
    }
    catch (error) {
        console.error(`Could not save a planet. Err: ${error}`)
    }
}


module.exports = {
    getAllPlanets,
    loadPlanets
}