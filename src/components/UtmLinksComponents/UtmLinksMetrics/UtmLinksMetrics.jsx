import React from 'react';
import './UtmLinksMetrics.scss';
import RightMetrics from "../RightMetrics/RightMetrics";
import LeftMetrics from "../LeftMetrics/LeftMetrics";

export default function UtmLinksMetrics({ leftMetrics, rightMetrics }) {
    const {mainMetric, subMetrics} = leftMetrics;

    return (
      <div className={'div-page-metrics-utmlinks'}>
          <LeftMetrics mainMetric={mainMetric} subMetrics={subMetrics} />
          <RightMetrics rightMetrics={rightMetrics} />
      </div>
    );
}
