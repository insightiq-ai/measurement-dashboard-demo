import React from 'react';
import './SummaryMetrics.scss';
import RightMetrics from "../RightMetrics/RightMetrics";
import LeftMetrics from "../LeftMetrics/LeftMetrics";

export default function SummaryMetrics({ leftMetrics, rightMetrics }) {
    const {mainMetric, subMetrics} = leftMetrics;

    return (
      <div className={'div-page-metrics-summary'}>
          <LeftMetrics mainMetric={mainMetric} subMetrics={subMetrics} />
          <RightMetrics rightMetrics={rightMetrics} />
      </div>
    );
}
