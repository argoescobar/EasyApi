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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const https_1 = __importDefault(require("https"));
/**
 * EasyApi class provides a simple way to create an Express server with built-in JWT authentication and optional HTTPS.
 */
class EasyApi {
    /**
     * Constructs a new EasyApi instance.
     * @param {EasyApiConfig} config Configuration options for the EasyApi server, including the JWT secret and optional HTTPS options.
     */
    constructor(config) {
        /**
         * Gracefully shuts down the server.
         */
        this.shutdown = () => {
            console.log("Gracefully shutting down");
            // Perform any cleanup and close connections here
            process.exit();
        };
        this.app = (0, express_1.default)();
        this.jwtSecret = config.jwtSecret;
        this.httpsOptions = config.httpsOptions;
        this.corsOptions = config.corsOptions;
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)(this.corsOptions || {}));
        this.app.use(this.verifyToken());
        process.on('SIGTERM', this.shutdown);
        process.on('SIGINT', this.shutdown);
    }
    /**
     * Starts the EasyApi server on the specified port.
     * @param {number} port The port number on which to start the server.
     */
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
    /**
     * Middleware to verify the JWT token provided in the request.
     * @returns {Middleware} The middleware function to use in the route definitions.
     */
    verifyToken() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Bearer <token>
            if (!token) {
                return res.status(403).send('Authentication token is missing.');
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret, { algorithms: ['HS256'] }); // Vahvempi algoritmi
                req.user = decoded;
                // Tähän voi lisätä rate limiting -logiikkaa tai muita turvatoimia.
                next();
            }
            catch (err) {
                if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    return res.status(401).send('Token has expired. Please log in again.');
                }
                else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    return res.status(401).send('Invalid Token. Please log in again.');
                }
                else {
                    // Muut mahdolliset virheet
                    return res.status(500).send('Internal Server Error.');
                }
            }
        });
    }
    // ... JWT token verification and other methods
    // ... (HTTP method implementations)
    /**
     * Defines an asynchronous GET route with optional middleware.
     * @param {Endpoint} endpoint The path for the route.
     * @param {AsyncCallback} callback The async function to handle requests to this route.
     * @param {...Middleware[]} middlewares Optional middleware to run before the route handler.
     */
    get(endpoint, callback, ...middlewares) {
        this.app.get(endpoint, ...middlewares, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield callback(req, res, next);
            }
            catch (error) {
                next(error);
            }
        }));
    }
    /**
     * Defines an asynchronous POST route with optional middleware.
     * @param {Endpoint} endpoint The path for the route.
     * @param {AsyncCallback} callback The async function to handle requests to this route.
     * @param {...Middleware[]} middlewares Optional middleware to run before the route handler.
     */
    post(endpoint, callback, ...middlewares) {
        this.app.post(endpoint, ...middlewares, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield callback(req, res, next);
            }
            catch (error) {
                next(error);
            }
        }));
    }
    /**
     * Defines an asynchronous PUT route with optional middleware.
     * @param {Endpoint} endpoint The path for the route.
     * @param {AsyncCallback} callback The async function to handle requests to this route.
     * @param {...Middleware[]} middlewares Optional middleware to run before the route handler.
     */
    put(endpoint, callback, ...middlewares) {
        this.app.put(endpoint, ...middlewares, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield callback(req, res, next);
            }
            catch (error) {
                next(error);
            }
        }));
    }
    /**
     * Defines an asynchronous DELETE route with optional middleware.
     * @param {Endpoint} endpoint The path for the route.
     * @param {AsyncCallback} callback The async function to handle requests to this route.
     * @param {...Middleware[]} middlewares Optional middleware to run before the route handler.
     */
    delete(endpoint, callback, ...middlewares) {
        this.app.delete(endpoint, ...middlewares, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield callback(req, res, next);
            }
            catch (error) {
                next(error);
            }
        }));
    }
    /**
     * Defines an asynchronous PATCH route with optional middleware.
     * @param {Endpoint} endpoint The path for the route.
     * @param {AsyncCallback} callback The async function to handle requests to this route.
     * @param {...Middleware[]} middlewares Optional middleware to run before the route handler.
     */
    patch(endpoint, callback, ...middlewares) {
        this.app.patch(endpoint, ...middlewares, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield callback(req, res, next);
            }
            catch (error) {
                next(error);
            }
        }));
    }
}
exports.default = EasyApi;
