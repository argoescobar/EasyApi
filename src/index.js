"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const endpointClass_1 = __importDefault(require("./class/endpointClass"));
const fs_1 = __importDefault(require("fs"));
// CREATE A NEW INSTANCE OF EASYAPI
// httpsOptions is optional, but if you want to use HTTPS, you must provide a key and certificate
// jwtSecret is required for token verification
// import jwtSecret from .env file 
const jwtSecret = process.env.JWT_SECRET || 'secret';
const api = new endpointClass_1.default({
    jwtSecret: jwtSecret,
    httpsOptions: {
        key: fs_1.default.readFileSync('private.key', 'utf8'),
        cert: fs_1.default.readFileSync('certificate.crt', 'utf8'),
    },
    corsOptions: {
        origin: 'http://localhost:3000',
    },
});
//crete a middleware function
const middleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Middleware function called');
    next();
});
// ADD ENDPOINTS TO THE API 
// addEndpoint takes three parameters: endpoint, callback
api.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('hello world');
}));
// 
api.get('/test2', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('hello world 2');
}), middleware);
api.start(3000);
