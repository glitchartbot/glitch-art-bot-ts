import winston from 'winston';
import { format } from 'winston';
const { combine, timestamp, printf } = format;

const logFormat = printf(({level, message, timestamp, id}) => 
  id ? 
    `${timestamp} [${level.toUpperCase()}] (${id}) ${message}` :
    `${timestamp} [${level.toUpperCase()}] ${message}`
)

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'general.log' })
  ],
  format: combine(
    timestamp({format: 'DD/MM/YYYY HH:mm:ss'}),
    logFormat
  )
}

const logger = winston.createLogger(options);

export default logger; 