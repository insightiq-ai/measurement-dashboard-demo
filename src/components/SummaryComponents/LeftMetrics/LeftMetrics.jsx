import React from 'react';
import { PerformanceMetric, Icons } from "../../index";
import './LeftMetrics.scss';
import LeftMainMetric from "../../LeftMainMetric/LeftMainMetric";

export default function LeftMetrics({ mainMetric, subMetrics }) {
    const { value: mainMetricValue, title: mainMetricTitle, tooltip } = mainMetric;
    return (
        <div className={'div-left-metrics-summary'}>
            <LeftMainMetric mainMetricTitle={mainMetricTitle} mainMetricValue={mainMetricValue} tooltip={tooltip} />
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
