import React from 'react';
import './UserMetrics.scss';
import LeftMainMetric from "../../LeftMainMetric/LeftMainMetric";
import { PerformanceMetric } from "../../index";
import SplitMetrics from "../SplitMetrics/SplitMetrics";

export default function UserMetrics({ totalOrderValue, ordersPlaced }) {
    return (
        <div className={'div-user-metrics-container'}>
            <div className={'div-user-metrics-box'}>
                <div className="div-user-metric-item item-1">
                    <LeftMainMetric mainMetricTitle={'Total order value'} mainMetricValue={totalOrderValue}/>
                    <PerformanceMetric
                        key={0}
                        variant={'infoMetricIcon'}
                        metricIcon={<i className="ri-computer-line"></i>}
                        content={ordersPlaced}
                        metricName={'Orders placed'}
                    />
                </div>
                <div className="divider"></div>
                <div className="div-user-metric-item">
                    <SplitMetrics title={'Platform split'} splitMetricsArray={[
                        {title: 'Desktop', value: '50%'},
                        {title: 'Mobile', value: '50%'}
                    ]}/>
                </div>
                <div className="divider"></div>
                <div className="div-user-metric-item">
                    <SplitMetrics title={'Creator split'} splitMetricsArray={[
                        {title: 'Desktop', value: '50%'},
                        {title: 'Mobile', value: '50%'}
                    ]}/>
                </div>
            </div>
        </div>
    )
}
