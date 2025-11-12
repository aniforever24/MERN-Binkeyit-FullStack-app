import express from 'express'
import 'dotenv/config';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB.js';
import dbConnectionError from './middlewares/dbConnectionErrorMW.js';
import user from './routes/userRoute.js';
import authUser from './routes/authuserRoute.js'
import authCategoryRoute from './routes/authcategoryRoute.js'
import authSubCategoryRoute from './routes/authSubCategoryRoute.js'
import subCategoryRouter from './routes/subCategoryRoute.js'
import cors from 'cors'
import helmet from 'helmet';
import refreshAccessTokenController from './controllers/refreshAccessTokenController.js';
import refreshAccessTokenMW from './middlewares/refreshAccessTokenMW.js';
import { refreshTokenErrMW } from './middlewares/errorMW.js';
import authProductsRoute from './routes/authProductsRoute.js';
import productsRouter from './routes/productsRoute.js'
import categoryRouter from './routes/categoryRoute.js'
import cartRouter from './routes/authCartRoute.js'
import addressRouter from './routes/authAddressRoute.js'


const app = express();


app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'));

// view engine setup
app.set('views', './views')
app.set('view engine', 'ejs')

// some configurations for seamless coordination between frontend and backend using different ports
// cors configuration
app.use(cors({
    origin: `${process.env.FRONTEND_BASEURI}`,
    credentials: true,
}))

// helmet configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", process.env.FRONTEND_BASEURI], // Allow frontend scripts
            connectSrc: ["'self'", process.env.FRONTEND_BASEURI],   // Allow API requests
        }
    }
}))

// Morgan time format configuration
morgan.token('timestamp', () => new Date().toLocaleString('en-IN', { timeZone: "Asia/Kolkata" }))

const morganFormat = ':remote-addr - :remote-user [:timestamp] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
let dbError;

// database connection
try {
    await connectDB();
} catch (error) {
    dbError = error
    console.log(error)
}

// Middlewares
app.use(morgan(morganFormat))
app.use(dbConnectionError(dbError))      // if error in db connection user will get response

// Route Handlers
app.use('/api/user', user);
app.use('/api/sub-category', subCategoryRouter)
app.use('/auth/user', authUser);
app.use('/auth/category', authCategoryRoute)
app.use('/auth/sub-category', authSubCategoryRoute)
app.use('/auth/products', authProductsRoute)
app.use('/api/products', productsRouter)
app.use('/api/category', categoryRouter)
app.use('/auth/cart', cartRouter)
app.use('/auth/user/address', addressRouter)

app.get('/testing', (req, res)=> res.send("Backend is working."))
app.post('/auth/refresh-token', refreshAccessTokenMW, refreshTokenErrMW ,refreshAccessTokenController)

const port = process.env.PORT || 3000;

app.listen(port, (er) => {
    if (er) {
        console.log('express app Error --->', er)
        return
    }
    console.log(`Server is running @${port}`)
})