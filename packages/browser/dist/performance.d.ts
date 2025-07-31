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
    commonErrors: Array<{
        error: string;
        count: number;
    }>;
}
/**
 * Collects and analyzes performance metrics for image loading
 */
export declare class PerformanceMonitor {
    private metrics;
    private maxMetrics;
    /**
     * Record a load attempt
     */
    recordLoad(metrics: LoadMetrics): void;
    /**
     * Get performance statistics
     */
    getStats(): PerformanceStats;
    /**
     * Get recent performance trend
     */
    getTrend(windowSize?: number): {
        successRate: number;
        averageLoadTime: number;
        cacheHitRate: number;
    };
    /**
     * Clear metrics
     */
    clear(): void;
    /**
     * Export metrics for analysis
     */
    exportMetrics(): LoadMetrics[];
}
//# sourceMappingURL=performance.d.ts.map