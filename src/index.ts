import EasyApi,{Middleware} from './class/endpointClass';
import fs from 'fs';
// CREATE A NEW INSTANCE OF EASYAPI
// httpsOptions is optional, but if you want to use HTTPS, you must provide a key and certificate
// jwtSecret is required for token verification

// import jwtSecret from .env file 
const jwtSecret = process.env.JWT_SECRET || 'secret';

const api = new EasyApi({
  jwtSecret: jwtSecret,
  httpsOptions: {
    key: fs.readFileSync('private.key', 'utf8'),
    cert: fs.readFileSync('certificate.crt', 'utf8'),
  },
  corsOptions: {
    origin: 'http://localhost:3000',
  },
 
  
});
//crete a middleware function
const middleware:Middleware = async (req, res, next) => {
  console.log('Middleware function called');
  next();
};

// ADD ENDPOINTS TO THE API 
// addEndpoint takes three parameters: endpoint, callback

api.get('/test',async (req:any, res:any) => {
  res.send('hello world');
});
// 
api.get('/test2',async (req:any, res:any) => {
  res.send('hello world 2');
}, middleware);

api.start(3000);
