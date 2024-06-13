import React from "react";
import { convertTimeToLocale, formatNumber, isEmpty } from "../../../utils/util";
import { PerformanceMetric } from "../../index";
import './AggregateMetrics.scss';

export default function AggregateMetrics({ user, userEvents }) {
    const totalEventsCollected = !isEmpty(user?.number_of_events) ? formatNumber(user?.number_of_events) : '-';
    const deviceCount = !isEmpty(user?.number_of_fingerprints) ? formatNumber(user?.number_of_fingerprints) : '-';
    const lastActiveOn = !isEmpty(userEvents?.event_timestamp) ? convertTimeToLocale(userEvents?.event_timestamp) : '-';

    return (
        <div className={'div-aggregate-metrics'}>
            <PerformanceMetric
                key={0}
                variant={'infoMetricIcon'}
                metricIcon={<i className="ri-computer-line"></i>}
                content={totalEventsCollected}
                metricName={'Total events collected'}
            />
            <PerformanceMetric
                key={1}
                variant={'infoMetricIcon'}
                metricIcon={<i className="ri-computer-line"></i>}
                content={deviceCount}
                metricName={'Device count'}
            />
            <PerformanceMetric
                key={2}
                variant={'infoMetricIcon'}
                metricIcon={<i className="ri-computer-line"></i>}
                content={lastActiveOn}
                metricName={'Last active on'}
                additionalStyles={{ width: 'unset' }}
            />
        </div>
    );
}
