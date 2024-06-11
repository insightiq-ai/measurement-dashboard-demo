import React from 'react';
import { PerformanceMetric, Icons } from "../index";
import './LeftMetrics.scss';

export default function LeftMetrics({ mainMetric, subMetrics }) {
    const { value: mainMetricValue, title: mainMetricTitle } = mainMetric;
    return (
        <div className={'div-left-metrics'}>
            <div className={'div-main-metric'}>
                <Icons.total_roi />
                <div className={'div-metric-and-title'}>
                    <div className={'div-metric'}>
                        {mainMetricValue}
                    </div>
                    <div className={'div-title'}>
                        {mainMetricTitle}
                    </div>
                </div>
            </div>
            <div className={'div-sub-metric'}>
                {subMetrics?.map(({ icon, value, name, subtitle, tooltip }) => {
                    return (
                        <PerformanceMetric
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
        </div>
    );
}
