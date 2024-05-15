import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  GetParameterCommand,
  SSMClient,
  SSMClientConfig,
} from '@aws-sdk/client-ssm';
import { ConfigService } from '@nestjs/config';

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

  async getParameter(parameterName: string): Promise<string> {
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
