import { Injectable, OnModuleInit } from "@nestjs/common";
import { Counter, Histogram, register } from "prom-client";

@Injectable()
export class MetricsService implements OnModuleInit {
  private requestSuccessHistogram: Histogram<string>;
  private requestFailHistogram: Histogram<string>;
  private failureCounter: Counter<string>;

  // 모듈올라갈때 초기화
  onModuleInit() {
    this.initializeMetrics();
  }

  // 반드시 nestjs_success_requests 등이 이미 metrics로 수집되고 있는지 없는지 확인해주어야한다.
  // 없을 때만 메트릭 new로 새로 등록가능 있으면 new로 메트릭 새로 생성하는 것이 아니라
  // 기존 메트릭 get
  private initializeMetrics() {
    if (!register.getSingleMetric('nestjs_success_requests')) {
      this.requestSuccessHistogram = new Histogram({
        name: 'nestjs_success_requests',
        help: 'NestJs success requests - duration in seconds',
        labelNames: ['handler', 'controller', 'method'],
        buckets: [
          0.0001, 0.001, 0.005, 0.01, 0.025, 0.05, 0.075, 0.09, 0.1, 0.25, 0.5,
          1, 2.5, 5, 10,
        ],
      });
    } else {
      this.requestSuccessHistogram = register.getSingleMetric(
        'nestjs_success_requests',
      ) as Histogram<string>;
    }

    if (!register.getSingleMetric('nestjs_fail_requests')) {
      this.requestFailHistogram = new Histogram({
        name: 'nestjs_fail_requests',
        help: 'NestJs fail requests - duration in seconds',
        labelNames: ['handler', 'controller', 'method'],
        buckets: [
          0.0001, 0.001, 0.005, 0.01, 0.025, 0.05, 0.075, 0.09, 0.1, 0.25, 0.5,
          1, 2.5, 5, 10,
        ],
      });
    } else {
      this.requestFailHistogram = register.getSingleMetric(
        'nestjs_fail_requests',
      ) as Histogram<string>;
    }

    if (!register.getSingleMetric('nestjs_requests_failed_count')) {
      this.failureCounter = new Counter({
        name: 'nestjs_requests_failed_count',
        help: 'NestJs requests that failed',
        labelNames: ['handler', 'controller', 'error', 'method'],
      });
    } else {
      this.failureCounter = register.getSingleMetric(
        'nestjs_requests_failed_count',
      ) as Counter<string>;
    }
  }

  // 성공 시에 시간재기
  startSuccessTimer(labels: Record<string, string>): () => void {
    return this.requestSuccessHistogram.startTimer(labels);
  }

  // 실패시에 시간재기
  startFailTimer(labels: Record<string, string>): () => void {
    return this.requestFailHistogram.startTimer(labels);
  }

  // 실패 횟수 상승시키기
  incrementFailureCounter(labels: Record<string, string>) {
    this.failureCounter.labels(labels).inc(1);
  }

  // metrics 수집한거 등록하기
  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
