import { div, Tooltip } from '@material-ui/core';
import React from 'react'
import "./PerformanceMetric.scss"
import * as PropTypes from "prop-types";
import { isEmpty } from "../../utils/util";
// variant  -> See propTypes below

export default function PerformanceMetric({ variant, metricIcon, content, metricName, tooltip, subtitle, additionalStyles }) {

    if (content === "null" || content === null) {
        content = "-"
    }


    const InfoIcon = () => {
        return (
            <div>
                <div className='metric-content'>{content}</div>
                <div className='info-name-container'>
                    {metricName}
                    {tooltip && <Tooltip placement='right-end' title={tooltip}>
                        <i className="ri-information-line info-icon"></i>
                    </Tooltip>}
                </div>
            </div>
        )
    }
    const InfoMetricIcon = () => {
        return (
            <div>
                <div className='metric-content'>{metricIcon}{content}</div>
                <div className='info-name-container'>
                    {metricName}
                    {tooltip && <Tooltip placement='right-end' title={tooltip}>
                        <i className="ri-information-line info-icon"></i>
                    </Tooltip>}
                </div>
            </div>
        )
    }
    const MetricIcon = () => {
        return (
            <div>
                <div className='metric-content'>{metricIcon}{content}</div>
                <div className='info-name-container'>{metricName} </div>
            </div>
        )
    }

    const DefaultComp = () => {
        return (
            <div>
                <div className='metric-content'>{content}</div>
                <div className='info-name-container'>{metricName}</div>
            </div>
        )
    }

    const performanceMetric = [];

    switch (variant) {
        case 'infoIcon':
            performanceMetric.push(<InfoIcon/>);
            break;
        case 'infoMetricIcon':
            performanceMetric.push(<InfoMetricIcon/>);
            break;
        case 'metricIcon':
            performanceMetric.push(<MetricIcon/>);
            break;
        default:
            performanceMetric.push(<DefaultComp/>);
            break;
    }

    if (!isEmpty(subtitle)) {
        performanceMetric.push(<hr/>);
        performanceMetric.push(<div className={"metrics-subtitle subtitle-r"}>
            {subtitle}
        </div>);
    }

    return <div className={'performance-metric'} style={additionalStyles}>{performanceMetric}</div>;
}

PerformanceMetric.propTypes = {
    variant: PropTypes.oneOf(['infoIcon', 'infoMetricIcon', 'metricIcon']),
}
