module.exports = {
  port: process.env.PORT || 8080,
  databaseURL: process.env.DATABASE_URL || '',
  env: process.env.NODE_ENV || 'development',
  services: {
    users: process.env.USERS_MS,
    projects: process.env.PROJECTS_MS,
    sponsors: process.env.SPONSORS_MS,
    payments: process.env.PAYMENT_GTW_MS,
    notifications: process.env.NOTIFICATIONS_MS
  },
  log: {
    error: process.env.LOG_ERROR == undefined || process.env.LOG_ERROR == 'true',
    warn: process.env.LOG_WARN == undefined || process.env.LOG_WARN == 'true',
    info: process.env.LOG_INFO == undefined || process.env.LOG_INFO == 'true',
    debug: process.env.LOG_DEBUG == undefined || process.env.LOG_DEBUG == 'true',
  }
}
