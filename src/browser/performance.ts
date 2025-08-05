export interface LoadMetrics {
  url: string;
  source: string;
  startTime: number;
  endTime: number;
  loadTime: number;
  fromCache: boolean;
  success: boolean;
  error?: string;
  retryCount: number;
  size?: number;
}

export interface PerformanceStats {
  totalLoads: number;
  successfulLoads: number;
  failedLoads: number;
  averageLoadTime: number;
  cacheHitRate: number;
  sourceSuccessRates: Record<string, number>;
  commonErrors: Array<{ error: string; count: number }>;
}

/**
 * Collects and analyzes performance metrics for image loading
 */
export class PerformanceMonitor {
  private metrics: LoadMetrics[] = [];
  private maxMetrics = 1000;

  /**
   * Record a load attempt
   */
  recordLoad(metrics: LoadMetrics): void {
    this.metrics.push(metrics);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Get performance statistics
   */
  getStats(): PerformanceStats {
    if (this.metrics.length === 0) {
      return {
        totalLoads: 0,
        successfulLoads: 0,
        failedLoads: 0,
        averageLoadTime: 0,
        cacheHitRate: 0,
        sourceSuccessRates: {},
        commonErrors: []
      };
    }

    const successful = this.metrics.filter(m => m.success);
    const failed = this.metrics.filter(m => !m.success);
    const cached = this.metrics.filter(m => m.fromCache);
    
    // Calculate source success rates
    const sourceStats: Record<string, { total: number; successful: number }> = {};
    for (const metric of this.metrics) {
      if (!sourceStats[metric.source]) {
        sourceStats[metric.source] = { total: 0, successful: 0 };
      }
      const stats = sourceStats[metric.source];
      if (stats) {
        stats.total++;
        if (metric.success) {
          stats.successful++;
        }
      }
    }

    const sourceSuccessRates: Record<string, number> = {};
    for (const [source, stats] of Object.entries(sourceStats)) {
      if (stats) {
        sourceSuccessRates[source] = stats.successful / stats.total;
      }
    }

    // Calculate common errors
    const errorCounts: Record<string, number> = {};
    for (const metric of failed) {
      if (metric.error) {
        errorCounts[metric.error] = (errorCounts[metric.error] || 0) + 1;
      }
    }

    const commonErrors = Object.entries(errorCounts)
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalLoads: this.metrics.length,
      successfulLoads: successful.length,
      failedLoads: failed.length,
      averageLoadTime: successful.reduce((sum, m) => sum + m.loadTime, 0) / successful.length || 0,
      cacheHitRate: cached.length / this.metrics.length,
      sourceSuccessRates,
      commonErrors
    };
  }

  /**
   * Get recent performance trend
   */
  getTrend(windowSize: number = 50): {
    successRate: number;
    averageLoadTime: number;
    cacheHitRate: number;
  } {
    const recent = this.metrics.slice(-windowSize);
    
    if (recent.length === 0) {
      return { successRate: 0, averageLoadTime: 0, cacheHitRate: 0 };
    }

    const successful = recent.filter(m => m.success);
    const cached = recent.filter(m => m.fromCache);

    return {
      successRate: successful.length / recent.length,
      averageLoadTime: successful.reduce((sum, m) => sum + m.loadTime, 0) / successful.length || 0,
      cacheHitRate: cached.length / recent.length
    };
  }

  /**
   * Clear metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): LoadMetrics[] {
    return [...this.metrics];
  }
}