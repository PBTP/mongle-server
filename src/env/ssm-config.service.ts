import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  GetParameterCommand,
  GetParametersByPathCommand,
  SSMClient,
  SSMClientConfig,
} from '@aws-sdk/client-ssm';
import { ConfigService } from '@nestjs/config';
import * as process from 'node:process';
import { Parameter } from '@aws-sdk/client-ssm/dist-types/models/models_1';

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
  const regex = /\/mgmg\/[^/]*\//;
  const nodeEnv = process.env.NODE_ENV;
  let nextToken: string | undefined;
  const parameters: Parameter[] = [];

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

    parameters.push(...response.Parameters);
    nextToken = response.NextToken;
  } while (nextToken);

  parameters.sort((a: Parameter, b: Parameter) => {
    const getWeight = (env: string) => {
      if (env.startsWith(`/mgmg/${nodeEnv}/`)) return 0;
      if (env.startsWith('/mgmg/prod/')) return 2;
      if (env.startsWith('/mgmg/dev/')) return 1;

      return 3;
    };

    return getWeight(b.Name) - getWeight(a.Name);
  });

  for (const parameter of parameters) {
    const name = parameter.Name;
    const key = name.replace(regex, '');

    key.indexOf('/') === 0
      ? (process.env[key.substring(1)] = parameter.Value)
      : (process.env[key] = parameter.Value);
  }
};
