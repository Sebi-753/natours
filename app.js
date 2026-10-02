const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const globalErrorHandeler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRouts');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Global middlewares

//Implement CORS
app.use(cors());

app.options('*', cors());

// app.use(express.static(`${__dirname}/public`)); //serving static files

app.use(express.static(path.join(__dirname, 'public')));

//Set security HTTP headers
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],

//         scriptSrc: [
//           "'self'",
//           'https://api.mapbox.com',
//           'https://cdn.jsdelivr.net',
//         ],

//         styleSrc: [
//           "'self'",
//           'https://api.mapbox.com',
//           'https://fonts.googleapis.com',
//         ],

//         imgSrc: ["'self'", 'data:', 'blob:', 'https://*.mapbox.com'],

//         connectSrc: ["'self'", 'https://*.mapbox.com'],

//         workerSrc: ["'self'", 'blob:'],
//       },
//     },
//   }),
// );
//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limmit requests to the api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests on this ip. Please try again in an hoer',
});
app.use('/api', limiter);

//Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitizatio against XSS(cross side scripting attacs)
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({ whitelist: ['duration', 'ratingsQuantity', 'maxGroupeSize', 'price'] }),
);

app.use(compression());
//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandeler);

module.exports = app;
