const request = require('supertest');
const app = require('../server'); // your express app

describe('GET /api/users', () => {
    it('should get all users', (done) => {
        request(app)
            .get('/api/users')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});