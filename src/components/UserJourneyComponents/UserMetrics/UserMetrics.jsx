import React from 'react';
import './UserMetrics.scss';
import LeftMainMetric from "../../LeftMainMetric/LeftMainMetric";
import { PerformanceMetric } from "../../index";
import SplitMetrics from "../SplitMetrics/SplitMetrics";
import { CREATOR_SPLIT } from "../../../utils/constants";

export default function UserMetrics({ creatorSplit, platformSplit, totalOrderValue, ordersPlaced }) {
    const splitMetricsForCreator = CREATOR_SPLIT.map((creator) => {
        return {
            icon: creator.icon,
            title: creator.title,
            metric: creatorSplit[creator.key]
        }
    });
    return (
        <div className={'div-user-metrics-container'}>
            <div className={'div-user-metrics-box'}>
                <div className="div-user-metric-item item-1">
                    <LeftMainMetric mainMetricTitle={'Total order value'}
                                    mainMetricValue={totalOrderValue}
                                    tooltip={'Tooltip'}/>
                    <PerformanceMetric
                        key={0}
                        variant={'infoMetricIcon'}
                        metricIcon={<i className="ri-archive-2-line"></i>}
                        content={ordersPlaced}
                        metricName={'Orders placed'}
                    />
                </div>
                <div className="divider"></div>
                <div className="div-user-metric-item">
                    <SplitMetrics title={'Platform split'} splitMetricsArray={platformSplit}/>
                </div>
                <div className="divider"></div>
                <div className="div-user-metric-item">
                    <SplitMetrics title={'Creator split'} splitMetricsArray={splitMetricsForCreator}/>
                </div>
            </div>
        </div>
    )
}
