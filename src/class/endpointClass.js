"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const https_1 = __importDefault(require("https"));
// EasyApi class definition
class EasyApi {
    constructor(config) {
        this.shutdown = () => {
            console.log("Gracefully shutting down");
            // Perform any cleanup and close connections here
            process.exit();
        };
        this.app = (0, express_1.default)();
        this.jwtSecret = config.jwtSecret;
        this.httpsOptions = config.httpsOptions;
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)());
        this.app.use(this.verifyToken());
        process.on('SIGTERM', this.shutdown);
        process.on('SIGINT', this.shutdown);
    }
    start(port) {
        try {
            console.log("Starting the server");
            if (this.httpsOptions) {
                console.log("HTTPS options provided, starting with HTTPS");
                const server = https_1.default.createServer({ key: this.httpsOptions.key, cert: this.httpsOptions.cert }, this.app);
                server.listen(port, () => console.log(`Listening with HTTPS on port ${port}`));
            }
            else {
                this.app.listen(port, () => console.log(`Listening with HTTP on port ${port}`));
            }
        }
        catch (error) {
            console.error("Failed to start the server:", error);
        }
    }
    verifyToken() {
        return (req, res, next) => {
            var _a;
            const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Bearer <token>
            if (!token) {
                return res.status(403).send('A token is required for authentication');
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
                if (typeof decoded === 'string') {
                    return res.status(401).send('Invalid Token');
                }
                req.user = decoded;
            }
            catch (err) {
                return res.status(401).send('Invalid Token');
            }
            return next();
        };
    }
    // ... (HTTP method implementations)
    get(endpoint, callback, ...middlewares) {
        this.app.get(endpoint, ...middlewares, callback);
    }
    post(endpoint, callback, ...middlewares) {
        this.app.post(endpoint, ...middlewares, callback);
    }
    put(endpoint, callback, ...middlewares) {
        this.app.put(endpoint, ...middlewares, callback);
    }
    delete(endpoint, callback, ...middlewares) {
        this.app.delete(endpoint, ...middlewares, callback);
    }
}
exports.default = EasyApi;
