import React from 'react';
import './SplitMetrics.scss';
import SplitIcon from "../SplitIcon/SplitIcon";

export default function SplitMetrics({title, splitMetricsArray}) {
    return (
        <div className={'div-split-metrics'}>
            <span className={'sub-section-heading color-neutrals-secondary-grey'}>{title}</span>
            <div className={'div-split-item-container'}>
                {splitMetricsArray?.map(SplitIcon)}
            </div>
        </div>
    );
}
