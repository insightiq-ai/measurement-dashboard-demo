import { Icons } from "../index";
import React from "react";
import './LeftMainMetric.scss';
import { Tooltip } from "@material-ui/core";

export default function LeftMainMetric({mainMetricTitle, mainMetricValue, tooltip}) {
    return (
        <div className={'div-main-metric-summary'}>
            <Icons.total_roi/>
            <div className={'div-metric-and-title-summary'}>
                <div className={'div-metric-summary'}>
                    {mainMetricValue}
                </div>
                <div className={'div-title-summary'}>
                    {mainMetricTitle}
                    {tooltip && <Tooltip placement='right-end' title={tooltip}>
                        <i className="ri-information-line info-icon"></i>
                    </Tooltip>}
                </div>
            </div>
        </div>
    )
}
