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
  private readonly prefix: string = `/mgmg/${process.env.NODE_ENV}/`;

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
  const regex = /mgmg\/.+?\//;
  let nextToken: string | undefined;

  const ssmClient = new SSMClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_IAM_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY,
    },
  });

  do {
    const response = await ssmClient.send(
      new GetParametersByPathCommand({
        Path: '/mgmg/',
        Recursive: true,
        WithDecryption: true,
        MaxResults: 10,
        NextToken: nextToken,
      }),
    );

    const parameters = response.Parameters.sort((a, b) => {
      const getWeight = (env) => {
        if (env === 'prod') return env === process.env.NODE_ENV ? 1 : 3;
        if (env === 'dev') return env === process.env.NODE_ENV ? 1 : 2;
        return 0;
      };

      const envA = a.Name.match(regex)[1];
      const envB = b.Name.match(regex)[1];
      return getWeight(envB) - getWeight(envA);
    });

    for (const parameter of parameters) {
      const name = parameter.Name;
      const key = name.replace(regex, '');
      key.indexOf('/') === 0
        ? (process.env[key.substring(1)] = parameter.Value)
        : (process.env[key] = parameter.Value);
    }

    nextToken = response.NextToken;
  } while (nextToken);
};
