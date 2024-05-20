import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  GetParameterCommand,
  GetParametersByPathCommand,
  SSMClient,
  SSMClientConfig,
} from '@aws-sdk/client-ssm';
import { ConfigService } from '@nestjs/config';
import * as process from 'node:process';

@Injectable()
export default class SSMConfigService {
  private readonly ssmClient: SSMClient;
  private readonly ssmClientConfig: SSMClientConfig;
  private readonly logger = new Logger(SSMConfigService.name);
  prefix = `/mgmg/${process.env.NODE_ENV}/`;

  constructor(private readonly configService: ConfigService) {
    this.ssmClientConfig = {
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_IAM_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_IAM_SECRET_ACCESS_KEY'),
      },
    };

    this.ssmClient = new SSMClient(this.ssmClientConfig);
  }

  async initEnvironmentValues(): Promise<void> {
    const parameters = await this.ssmClient
      .send(
        new GetParametersByPathCommand({
          Path: this.prefix,
        }),
      )
      .then((v) => {
        return v.Parameters;
      });

    for (const parameter of parameters) {
      const split: string[] = parameter.Name.split('/');
      this.configService.set(split[split.length - 1], parameter.Value);
    }
  }

  async getParameter(parameterName: string): Promise<string> {
    const value = this.configService.get(parameterName);
    if (value) {
      return value;
    }

    const params = {
      Name: `${this.prefix}${parameterName}`,
      WithDecryption: true,
    };

    return this.ssmClient
      .send(new GetParameterCommand(params))
      .then((response) => {
        return response.Parameter.Value;
      })
      .catch((error) => {
        this.logger.error(error);

        if (error.message === 'UnknownError') {
          throw new NotFoundException('Parameter Not Found');
        }

        throw error;
      });
  }
}

export const loadParameterStoreValue = async () => {
  return new SSMClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_IAM_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY,
    },
  })
    .send(
      new GetParametersByPathCommand({
        Path: `/mgmg/${process.env.NODE_ENV}/`,
      }),
    )
    .then((v) => {
      for (const parameter of v.Parameters) {
        const split: string[] = parameter.Name.split('/');
        process.env[split[split.length - 1]] = parameter.Value;
      }
    });
};
