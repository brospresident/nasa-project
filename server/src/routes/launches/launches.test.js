const request = require('supertest');
const app = require('../../app');

const { mongoConnect, mongoDisconnect } = require('../../services/mongo');



describe('Testing launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });


    describe('Test /GET launches', () => {
        test('Should get 200 ok response', async () => {
            const resp = await request(app).get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
        });
    });
    
    describe('Test /POST launches', () => {
        const launchData = {
            mission: 'Test mission',
            rocket: 'Something that won\'t explode',
            target: 'Kepler-62 f',
            launchDate: 'April 01, 2033'
        }
    
        const launchDataWithoutDate = {
            mission: 'Test mission',
            rocket: 'Something that won\'t explode',
            target: 'Kepler-62 f',
        }
        test('Should get 201 created response', async () => {
            const resp = await request(app)
                .post('/launches')
                .send(launchData)
                .expect('Content-Type', /json/)
                .expect(201);
    
            const requestDate = new Date(launchData.launchDate).valueOf();
            const respDate = new Date(resp.body.launchDate).valueOf();
    
            expect(respDate).toBe(requestDate);
                
            expect(resp.body).toMatchObject(launchDataWithoutDate);
        })
    
        test('Should get missing field', async () => {
            const resp = await request(app)
                .post('/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(resp.body).toStrictEqual({
                error: 'One missing field.'
            });
        });
    
        const launchDataWithInvalidDate = {
            mission: 'Test mission',
            rocket: 'Something that won\'t explode',
            target: 'A planet',
            launchDate: 'aaaa'
        }
    
        test('Should get bad date', async () => {
            const resp = await request(app)
                .post('/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(resp.body).toStrictEqual({
                error: 'Bad date'
            });
        })
    });
})