import express, { Application, Request as ExpressRequest, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import https from 'https';

// Define interfaces and types
interface Request extends ExpressRequest {
  user?: jwt.JwtPayload;
}

interface HttpsOptions {
  key: string;
  cert: string;
}

interface EasyApiConfig {
  jwtSecret: string;
  httpsOptions?: HttpsOptions;
}

export type Endpoint = string;
export type Callback = (request: Request, response: Response) => void;
export type Middleware = (request: Request, response: Response, next: NextFunction) => void;

/**
 * EasyApi class provides a simple way to create an Express server with built-in JWT authentication and optional HTTPS.
 */
class EasyApi {
  app: Application;
  jwtSecret: string;
  httpsOptions?: HttpsOptions;

  /**
   * Constructs a new EasyApi instance.
   * @param {EasyApiConfig} config Configuration options for the EasyApi server, including the JWT secret and optional HTTPS options.
   */
  constructor(config: EasyApiConfig) {
    this.app = express();
    this.jwtSecret = config.jwtSecret;
    this.httpsOptions = config.httpsOptions;

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(this.verifyToken());

    process.on('SIGTERM', this.shutdown);
    process.on('SIGINT', this.shutdown);
  }

  /**
   * Starts the EasyApi server on the specified port.
   * @param {number} port The port number on which to start the server.
   */
  start(port: number): void {
    try {
      console.log("Starting the server");
      if (this.httpsOptions) {
        console.log("HTTPS options provided, starting with HTTPS");
        const server = https.createServer({ key: this.httpsOptions.key, cert: this.httpsOptions.cert }, this.app);
        server.listen(port, () => console.log(`Listening with HTTPS on port ${port}`));
      } else {
        this.app.listen(port, () => console.log(`Listening with HTTP on port ${port}`));
      }
    } catch (error) {
      console.error("Failed to start the server:", error);
    }
  }

  /**
   * Gracefully shuts down the server.
   */
  private shutdown = () => {
    console.log("Gracefully shutting down");
    // Perform any cleanup and close connections here
    process.exit();
  };

  /**
   * Middleware to verify the JWT token provided in the request.
   * @returns {Middleware} The middleware function to use in the route definitions.
   */
  private verifyToken(): Middleware {
    return (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
      
      if (!token) {
        return res.status(403).send('A token is required for authentication');
      }

      try {
          const decoded = jwt.verify(token, this.jwtSecret);
          if (typeof decoded === 'string') {
            return res.status(401).send('Invalid Token');
          }
          req.user = decoded;
        } catch (err) {
          return res.status(401).send('Invalid Token');
        }

      return next();
    };
  }

  // ... (HTTP method implementations)

/**
   * Defines a GET route with optional middleware.
   * @param {Endpoint} endpoint The path for the route.
   * @param {Callback} callback The function to handle requests to this route.
   * @param {...Middleware[]} middlewares Optional middleware to run before the route handler.
   */
get(endpoint: Endpoint, callback: Callback, ...middlewares: Middleware[]): void {
  this.app.get(endpoint, ...middlewares, callback);
}

/**
 * Defines a POST route with optional middleware.
 * @param {Endpoint} endpoint The path for the route.
 * @param {Callback} callback The function to handle requests to this route.
 * @param {...Middleware[]} middlewares Optional middleware to run before the route handler.
 */
post(endpoint: Endpoint, callback: Callback, ...middlewares: Middleware[]): void {
  this.app.post(endpoint, ...middlewares, callback);
}

/**
 * Defines a PUT route with optional middleware.
 * @param {Endpoint} endpoint The path for the route.
 * @param {Callback} callback The function to handle requests to this route.
 * @param {...Middleware[]} middlewares Optional middleware to run before the route handler.
 */
put(endpoint: Endpoint, callback: Callback, ...middlewares: Middleware[]): void {
  this.app.put(endpoint, ...middlewares, callback);
}

/**
 * Defines a DELETE route with optional middleware.
 * @param {Endpoint} endpoint The path for the route.
 * @param {Callback} callback The function to handle requests to this route.
 * @param {...Middleware[]} middlewares Optional middleware to run before the route handler.
 */
delete(endpoint: Endpoint, callback: Callback, ...middlewares: Middleware[]): void {
  this.app.delete(endpoint, ...middlewares, callback);
}
}

export default EasyApi;
