import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

function getLogOption(level: string) {
  return new winston.transports.Console({
    level: level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike('mongle-server', {
        colors: true,
        prettyPrint: true,
      }),
    ),
  });
}

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    getLogOption('info'),
    getLogOption('warn'),
    getLogOption('error'),
  ],
});
