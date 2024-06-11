import React from 'react';
import './PageMetrics.scss';
import { LeftMetrics } from "../index";
import RightMetrics from "../RightMetrics/RightMetrics";

export default function PageMetrics({ leftMetrics, rightMetrics }) {
    const {mainMetric, subMetrics} = leftMetrics;

    return (
      <div className={'div-page-metrics'}>
          <LeftMetrics mainMetric={mainMetric} subMetrics={subMetrics} />
          <RightMetrics rightMetrics={rightMetrics} />
      </div>
    );
}
