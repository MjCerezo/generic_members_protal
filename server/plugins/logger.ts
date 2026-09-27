import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

// Initialize the file logger using runtime config values
let logger: winston.Logger | null = null

function getLogger(config: {
  logFile: string
  logArchivePattern: string
  logMaxSize: string
  logMaxHistory: string
}): winston.Logger {
  if (logger) return logger

  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [nitro] ${level.toUpperCase().padEnd(5)} - ${message}`
    })
  )

  logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
      // Console output
      new winston.transports.Console({ format: logFormat }),

      // Main rolling log file (size + date based)
      new DailyRotateFile({
        filename: config.logArchivePattern,
        datePattern: 'YYYY-MM-DD',
        maxSize: config.logMaxSize,     // e.g. 5m = 5MB
        maxFiles: config.logMaxHistory, // e.g. 30 days
        auditFile: `${config.logFile}.audit.json`,
        // Write current log to the non-archived path
        symlinkName: config.logFile,
        createSymlink: false,
      }),

      // Error-only log file
      new DailyRotateFile({
        filename: config.logArchivePattern.replace('%DATE%', 'error-%DATE%'),
        datePattern: 'YYYY-MM-DD',
        maxSize: config.logMaxSize,
        maxFiles: config.logMaxHistory,
        level: 'error',
      }),
    ],
  })

  return logger
}

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()

  const log = getLogger({
    logFile:           config.logFile           as string,
    logArchivePattern: config.logArchivePattern as string,
    logMaxSize:        config.logMaxSize        as string,
    logMaxHistory:     config.logMaxHistory     as string,
  })

  log.info('Nitro server started — file logging initialized')

  // Log every incoming request
  nitroApp.hooks.hook('request', (event) => {
    log.info(`${event.method} ${event.path}`)
  })

  // Log server-side errors
  nitroApp.hooks.hook('error', (error, { event }) => {
    const path = event?.path ?? 'unknown'
    log.error(`${path} — ${error.message ?? error}`)
  })
})
