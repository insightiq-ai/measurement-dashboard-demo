import React from 'react';
import { PerformanceMetric, Icons } from "../../index";
import './LeftMetrics.scss';
import { Tooltip } from "@material-ui/core";

export default function LeftMetrics({ mainMetric, subMetrics }) {
    const { value: mainMetricValue, title: mainMetricTitle, tooltip } = mainMetric;
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
                        {tooltip && <Tooltip placement='right-end' title={tooltip}>
                            <i className="ri-information-line info-icon"></i>
                        </Tooltip>}
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
