import React from 'react';
import './UserMetrics.scss';
import LeftMainMetric from "../../LeftMainMetric/LeftMainMetric";
import { Icons, PerformanceMetric } from "../../index";
import SplitMetrics from "../SplitMetrics/SplitMetrics";
import { currencyFormatter, formatNumber } from "../../../utils/util";

export default function UserMetrics({ platformSplit, totalOrderValue, ordersPlaced }) {
    const CREATOR_SPLIT = [
        { icon: <Icons.youtube_demo/>, title: 'Aakash', metric: currencyFormatter.format(totalOrderValue / 2) },
        { icon: <Icons.instagram_demo/>, title: 'Dhruv', metric: currencyFormatter.format(totalOrderValue / 4) },
        { icon: <Icons.twitter_demo/>, title: 'Mike', metric: currencyFormatter.format(totalOrderValue / 4) }
    ];
    return (
        <div className={'div-user-metrics-container'}>
            <div className={'div-user-metrics-box'}>
                <div className="div-user-metric-item item-1">
                    <LeftMainMetric mainMetricTitle={'Total order value'}
                                    mainMetricValue={currencyFormatter.format(totalOrderValue)}/>
                    <PerformanceMetric
                        key={0}
                        variant={'infoMetricIcon'}
                        metricIcon={<i className="ri-computer-line"></i>}
                        content={formatNumber(ordersPlaced)}
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
