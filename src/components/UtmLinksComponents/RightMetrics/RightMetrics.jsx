import React from 'react';
import { PerformanceMetric } from "../../index";
import './RightMetrics.scss';

export default function RightMetrics({ rightMetrics }) {
    return (
        <div className={'div-right-metrics-utmlinks'}>
            {rightMetrics?.map(({ icon, value, name, tooltip }, index) => {
                return (
                    <div key={index}>
                        <div className={'div-right-single-metric-utmlinks'}>
                            <span className={'performance-metric-icon'}>{icon}</span>
                            <PerformanceMetric
                                variant={'infoIcon'}
                                content={value}
                                metricName={name}
                                tooltip={tooltip}
                            />
                        </div>
                        {index < rightMetrics.length - 1 && (
                            <div className="vertical-line-utmlinks"></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
