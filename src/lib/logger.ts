type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

function createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };
}

function output(entry: LogEntry) {
  const formatted = JSON.stringify(entry);
  switch (entry.level) {
    case 'error':
      console.error(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    case 'debug':
      console.debug(formatted);
      break;
    default:
      console.log(formatted);
  }
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) =>
    output(createLogEntry('debug', message, context)),
  info: (message: string, context?: Record<string, unknown>) =>
    output(createLogEntry('info', message, context)),
  warn: (message: string, context?: Record<string, unknown>) =>
    output(createLogEntry('warn', message, context)),
  error: (message: string, context?: Record<string, unknown>) =>
    output(createLogEntry('error', message, context)),
};
