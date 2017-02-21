import express from 'express';
import * as path from 'path';
import request from 'request';
import Promise from 'promise';

class Server {
    constructor() {
        this.express = express();
        this.config();
        this.routes();
    }
    
    // static folders
    config() {
        this.express.use('/build', express.static(path.join(__dirname, './../../build/')));
        this.express.use('/node_modules', express.static(path.join(__dirname, './../../node_modules/')));
    }
    
    // calls to 3rd party backend API
    getAirports(query, resolve) {
        request({url: 'http://node.locomote.com/code-task/airports', qs: query}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            }
        });
    }
    
    getAirlines(resolve) {
        request('http://node.locomote.com/code-task/airlines', function (error, response, body) {
            if (!error && response.statusCode == 200) {
               resolve(JSON.parse(body));
            }
        });
    }
    
    search(query, code, resolve) {
        return request({url: 'http://node.locomote.com/code-task/flight_search/' + code, qs: query}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            }
        });
    }

    routes() {
        let router = express.Router();
        router.get('/', (req, res, next) => {
            res.sendFile(path.join(__dirname + './../../build/index.html'));
        });
        router.get('/airlines', (req, res, next) => {
            let self = this;
            let promise = new Promise(function(resolve, reject) {
                self.getAirlines(resolve);
            });
            return promise.then(function(result) {
                return res.json(result);
            });
        });
        router.get('/airports', (req, res, next) => {
            let self = this;
            let promise = new Promise(function(resolve, reject) {
                self.getAirports(req.query, resolve);
            });
            return promise.then(function(result) {
                return res.json(result.map((airport) => {
                    return {
                        value: airport.cityName + ", " + airport.airportName,
                        data: airport.airportCode
                    };
                }));
            });
        });
        router.get('/search', (req, res, next) => {
            let self = this;
            // getting airlines 
            let promise = new Promise(function(resolve, reject) {
                return self.getAirlines(resolve);
            });
            let results = [];
            // when we have airlines, getting result by search query
            return promise.then(function(result) {
                let airlinesList = result;
                let promises = airlinesList.map((list) => {
                    return new Promise(function(resolve, reject) {
                        self.search(req.query, list.code, resolve);
                    });
                });
                // when all 'airline' results are here, concatting an array with results
                return Promise.all(promises).then((promiseResults) => {
                    promiseResults.forEach((searchResult) => {
                        results = results.concat(searchResult);
                    });
                    return res.json(results);
                });
            });
        });
        this.express.use('/', router);
    }

}

export default new Server().express;