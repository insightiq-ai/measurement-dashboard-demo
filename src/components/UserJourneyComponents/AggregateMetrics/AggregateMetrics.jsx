import React, { useEffect, useState } from "react";
import { convertTimeToLocale, formatNumber, isEmpty } from "../../../utils/util";
import { getUserById, getUserEvents } from "../../../api/api";
import { PerformanceMetric } from "../../index";
import './AggregateMetrics.scss';

export default function AggregateMetrics({ userId }) {
    const [totalEventsCollected, setTotalEventsCollected] = useState('-');
    const [deviceCount, setDeviceCount] = useState('-');
    const [lastActiveOn, setLastActiveOn] = useState('-');
    useEffect(() => {
        if (!isEmpty(userId)) {
            getUserById({ userId }).then((res) => {
                console.log(`getUserById`);
                console.log(res);
                !isEmpty(res?.number_of_events) && setTotalEventsCollected(formatNumber(res?.number_of_events));
                !isEmpty(res?.number_of_fingerprints) && setDeviceCount(formatNumber(res?.number_of_fingerprints));
            });
            getUserEvents({ userId, limit: 1 }).then((res) => {
                console.log(`getUserEvents`);
                console.log(res);
                !isEmpty(res?.data[0]?.event_timestamp) && setLastActiveOn(convertTimeToLocale(res?.data[0]?.event_timestamp));
            });
        }
    }, [userId]);
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
                additionalStyles={{width: 'unset'}}
            />
        </div>
    );
}
