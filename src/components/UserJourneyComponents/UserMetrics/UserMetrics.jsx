import React from 'react';
import './UserMetrics.scss';
import LeftMainMetric from "../../LeftMainMetric/LeftMainMetric";
import { PerformanceMetric } from "../../index";
import SplitMetrics from "../SplitMetrics/SplitMetrics";
import { Icons } from "../../index";
import { CREATOR_SPLIT } from "../../../utils/constants";

export default function UserMetrics({ platformSplit, totalOrderValue, ordersPlaced }) {
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
                    <SplitMetrics title={'Platform split'} splitMetricsArray={
                        platformSplit
                    //     [
                    //     {icon: <Icons.youtube_demo />, title: 'YouTube', metric: 1000},
                    //     {icon: <Icons.instagram_demo />, title: 'Instagram', metric: 500},
                    //     {icon: <Icons.twitter_demo />, title: 'Twitter', metric: 500},
                    // ]
                    }/>
                </div>
                <div className="divider"></div>
                <div className="div-user-metric-item">
                    <SplitMetrics title={'Creator split'} splitMetricsArray={CREATOR_SPLIT}/>
                </div>
            </div>
        </div>
    )
}
