import React from 'react';
import { PerformanceMetric, Icons } from "../../index";
import './LeftMetrics.scss';

export default function LeftMetrics({ mainMetric, subMetrics }) {
    const { value: mainMetricValue, title: mainMetricTitle } = mainMetric;
    return (
        <div className={'div-left-metrics-summary'}>
            <div className={'div-main-metric-summary'}>
                <Icons.total_roi />
                <div className={'div-metric-and-title-summary'}>
                    <div className={'div-metric-summary'}>
                        {mainMetricValue}
                    </div>
                    <div className={'div-title-summary'}>
                        {mainMetricTitle}
                    </div>
                </div>
            </div>
            <div className={'div-sub-metric-summary'}>
                {subMetrics?.map(({ icon, value, name, subtitle, tooltip }, index) => {
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
        </div>
    );
}
