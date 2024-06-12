import React from 'react';
import { PerformanceMetric, Icons } from "../../index";
import './LeftMetrics.scss';

export default function LeftMetrics({ mainMetric, subMetrics }) {
    const { value: mainMetricValue, title: mainMetricTitle } = mainMetric;
    return (
        <div className={'div-left-metrics-utmlinks'}>
            <div className={'div-main-metric-utmlinks'}>
                <Icons.ctr />
                <div className={'div-metric-and-title-utmlinks'}>
                    <div className={'div-metric-utmlinks'}>
                        {mainMetricValue}
                    </div>
                    <div className={'div-title-utmlinks'}>
                        {mainMetricTitle}
                    </div>
                </div>
            </div>
            <div className={'div-sub-metric-utmlinks'}>
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
