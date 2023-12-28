"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const endpointClass_1 = __importDefault(require("./class/endpointClass"));
const fs_1 = __importDefault(require("fs"));
// CREATE A NEW INSTANCE OF EASYAPI
// httpsOptions is optional, but if you want to use HTTPS, you must provide a key and certificate
// jwtSecret is required for token verification
const api = new endpointClass_1.default({
    jwtSecret: 'secret',
    httpsOptions: {
        key: fs_1.default.readFileSync('private.key', 'utf8'),
        cert: fs_1.default.readFileSync('certificate.crt', 'utf8'),
    },
});
//crete a middleware function
const middleware = (req, res, next) => {
    console.log('Middleware function called');
    next();
};
// ADD ENDPOINTS TO THE API 
// addEndpoint takes three parameters: endpoint, callback
api.get('/test', (req, res) => {
    res.send('hello world');
});
api.get('/test2', (req, res) => {
    res.send('hello world 2');
}, middleware);
api.start(3000);
