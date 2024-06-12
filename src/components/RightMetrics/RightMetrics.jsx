import React from 'react';
import { PerformanceMetric } from "../index";
import './RightMetrics.scss';

export default function RightMetrics({ rightMetrics }) {
    return (
        <div className={'div-right-metrics'}>
            {rightMetrics?.map(({ icon, value, name, subtitle, tooltip }, index) => {
                return (
                    <PerformanceMetric
                        key={index}
                        variant={'infoMetricIcon'}
                        metricIcon={icon}
                        content={value}
                        metricName={name}
                        tooltip={tooltip}
                        subtitle={subtitle}
                    />
                );
            })}
        </div>
    );
}
