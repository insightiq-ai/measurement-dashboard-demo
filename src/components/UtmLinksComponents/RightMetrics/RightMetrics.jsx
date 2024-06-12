import React from 'react';
import { PerformanceMetric } from "../../index";
import './RightMetrics.scss';

export default function RightMetrics({ rightMetrics }) {
    return (
        <div className={'div-right-metrics-utmlinks'}>
            {rightMetrics?.map(({ icon, value, name }, index) => {
                return (
                    <div key={index}>
                        <div className={'div-right-single-metric-utmlinks'}>
                            {icon}
                            <PerformanceMetric
                                variant={'infoIcon'}
                                content={value}
                                metricName={name}
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
