import { MetricsService } from "./metrics.service";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, OnModuleInit } from "@nestjs/common";
import { Counter, Gauge, Histogram } from "prom-client";
import { catchError, Observable, tap } from "rxjs";

@Injectable()
export class MetricsInterceptor implements NestInterceptor, OnModuleInit {
  constructor(private readonly metricsService: MetricsService) {}

  // 초기화 각 수집 metrics 초기화
  onModuleInit() {
    this.requestSuccessHistogram.reset();
    this.requestFailHistogram.reset();
    this.failureCounter.reset();
  }

  // status code 2XX 요청 성공동안 걸리는 시간
  private readonly requestSuccessHistogram = new Histogram({
    name: 'nestjs_success_requests',
    help: 'NestJs success requests - duration in seconds',
    labelNames: ['handler', 'controller', 'method'],
    buckets: [
      0.0001, 0.001, 0.005, 0.01, 0.025, 0.05, 0.075, 0.09, 0.1, 0.25, 0.5, 1,
      2.5, 5, 10,
    ],
  });

  // status code != 2XX 실패 동안 걸리는 시간
  private readonly requestFailHistogram = new Histogram({
    name: 'nestjs_fail_requests',
    help: 'NestJs fail requests - duration in seconds',
    labelNames: ['handler', 'controller', 'method'],
    buckets: [
      0.0001, 0.001, 0.005, 0.01, 0.025, 0.05, 0.075, 0.09, 0.1, 0.25, 0.5, 1,
      2.5, 5, 10,
    ],
  });

  // 요청 실패 횟수
  private readonly failureCounter = new Counter({
    name: 'nestjs_requests_failed_count',
    help: 'NestJs requests that failed',
    labelNames: ['handler', 'controller', 'error', 'method'],
  });

  static registerServiceInfo(serviceInfo: {
    domain: string;
    name: string;
    version: string;
  }): MetricsInterceptor {
    new Gauge({
      name: 'nestjs_info',
      help: 'NestJs service version info',
      labelNames: ['domain', 'name', 'version'],
    }).set(
      {
        domain: serviceInfo.domain,
        name: `${serviceInfo.domain}.${serviceInfo.name}`,
        version: serviceInfo.version,
      },
      1,
    );

    return new MetricsInterceptor(new MetricsService());
  }

  // metrics가 포함된 url 요청은 수집 X
  private isAvailableMetricsUrl(url: string): boolean {
    const excludePaths = 'metrics';
    if (url.includes(excludePaths)) {
      return false;
    }
    return true;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const originUrl = context.switchToHttp().getRequest().url.toString();

    const method = context.switchToHttp().getRequest().method.toString();
    const labels = {
      controller: context.getClass().name,
      handler: context.getHandler().name,
      method: method,
    };

    try {
      const requestSuccessTimer =
        this.requestSuccessHistogram.startTimer(labels);

      const requestFailTimer = this.requestFailHistogram.startTimer(labels);
      return next.handle().pipe(
        tap(() => {
          if (this.isAvailableMetricsUrl(originUrl)) {
            this.metricsService.startSuccessTimer(labels);
          }
        }),
        catchError((err) => {
          if (this.isAvailableMetricsUrl(originUrl)) {
            this.metricsService.startFailTimer(labels);
            this.metricsService.incrementFailureCounter(labels);
          }
          throw err;
        }),
      );
    } catch (error) {}
  }
}
