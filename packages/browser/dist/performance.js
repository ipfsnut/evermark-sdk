/**
 * Collects and analyzes performance metrics for image loading
 */
export class PerformanceMonitor {
    metrics = [];
    maxMetrics = 1000;
    /**
     * Record a load attempt
     */
    recordLoad(metrics) {
        this.metrics.push(metrics);
        // Keep only recent metrics
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }
    }
    /**
     * Get performance statistics
     */
    getStats() {
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
        const sourceStats = {};
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
        const sourceSuccessRates = {};
        for (const [source, stats] of Object.entries(sourceStats)) {
            if (stats) {
                sourceSuccessRates[source] = stats.successful / stats.total;
            }
        }
        // Calculate common errors
        const errorCounts = {};
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
    getTrend(windowSize = 50) {
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
    clear() {
        this.metrics = [];
    }
    /**
     * Export metrics for analysis
     */
    exportMetrics() {
        return [...this.metrics];
    }
}
//# sourceMappingURL=performance.js.map