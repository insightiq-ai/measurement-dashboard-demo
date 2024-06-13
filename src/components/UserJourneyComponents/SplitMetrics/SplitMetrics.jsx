import React from 'react';
import './SplitMetrics.scss';

export default function SplitMetrics({title, splitMetricsArray}) {
    return (
        <div className={'div-split-metrics'}>
            <span className={'sub-section-heading color-neutrals-secondary-grey'}>{title}</span>
            <div className={'div-split-metrics-container'}>
                {splitMetricsArray?.map((splitMetric, index) => (
                    <div key={index} className={'div-split-metric'}>
                        <span className={'split-metric-title'}>{splitMetric.title}</span>
                        <span className={'split-metric-value'}>{splitMetric.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
