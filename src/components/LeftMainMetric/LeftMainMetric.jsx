import { Icons } from "../index";
import React from "react";
import './LeftMainMetric.scss';

export default function LeftMainMetric({mainMetricTitle, mainMetricValue}) {
    return (
        <div className={'div-main-metric-summary'}>
            <Icons.total_roi/>
            <div className={'div-metric-and-title-summary'}>
                <div className={'div-metric-summary'}>
                    {mainMetricValue}
                </div>
                <div className={'div-title-summary'}>
                    {mainMetricTitle}
                </div>
            </div>
        </div>
    )
}
