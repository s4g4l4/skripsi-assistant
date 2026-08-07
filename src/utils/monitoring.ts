export interface MetricsStore {
  totalRequests: number;
  totalErrors: number;
  activeRequests: number;
  statusCodes: Record<number, number>;
  requestDurations: number[];
  startTime: number;
}

class MonitoringService {
  private metrics: MetricsStore = {
    totalRequests: 0,
    totalErrors: 0,
    activeRequests: 0,
    statusCodes: {},
    requestDurations: [],
    startTime: Date.now(),
  };

  public recordRequest(statusCode: number, durationMs: number) {
    this.metrics.totalRequests++;
    if (statusCode >= 400) {
      this.metrics.totalErrors++;
    }
    this.metrics.statusCodes[statusCode] = (this.metrics.statusCodes[statusCode] || 0) + 1;

    // Keep last 1000 duration samples for average calculation
    this.metrics.requestDurations.push(durationMs);
    if (this.metrics.requestDurations.length > 1000) {
      this.metrics.requestDurations.shift();
    }
  }

  public incrementActiveRequests() {
    this.metrics.activeRequests++;
  }

  public decrementActiveRequests() {
    this.metrics.activeRequests = Math.max(0, this.metrics.activeRequests - 1);
  }

  public getPrometheusMetrics(): string {
    const uptimeSec = Math.floor((Date.now() - this.metrics.startTime) / 1000);
    const avgDuration =
      this.metrics.requestDurations.length > 0
        ? (this.metrics.requestDurations.reduce((a, b) => a + b, 0) / this.metrics.requestDurations.length).toFixed(2)
        : '0';

    let output = `# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total ${this.metrics.totalRequests}

# HELP http_requests_errors_total Total number of HTTP requests resulting in errors
# TYPE http_requests_errors_total counter
http_requests_errors_total ${this.metrics.totalErrors}

# HELP http_active_requests Currently active HTTP requests
# TYPE http_active_requests gauge
http_active_requests ${this.metrics.activeRequests}

# HELP http_request_duration_ms_avg Average HTTP request duration in milliseconds
# TYPE http_request_duration_ms_avg gauge
http_request_duration_ms_avg ${avgDuration}

# HELP app_uptime_seconds Application uptime in seconds
# TYPE app_uptime_seconds counter
app_uptime_seconds ${uptimeSec}
`;

    Object.entries(this.metrics.statusCodes).forEach(([code, count]) => {
      output += `http_requests_by_status{status="${code}"} ${count}\n`;
    });

    return output;
  }

  public getJSONMetrics() {
    const uptimeSec = Math.floor((Date.now() - this.metrics.startTime) / 1000);
    const avgDuration =
      this.metrics.requestDurations.length > 0
        ? Number((this.metrics.requestDurations.reduce((a, b) => a + b, 0) / this.metrics.requestDurations.length).toFixed(2))
        : 0;

    return {
      uptimeSeconds: uptimeSec,
      totalRequests: this.metrics.totalRequests,
      totalErrors: this.metrics.totalErrors,
      activeRequests: this.metrics.activeRequests,
      averageDurationMs: avgDuration,
      statusCodes: this.metrics.statusCodes,
      memoryUsage: process.memoryUsage(),
    };
  }
}

export const monitoring = new MonitoringService();
