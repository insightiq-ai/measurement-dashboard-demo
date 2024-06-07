import { div, Tooltip } from '@material-ui/core';
import React from 'react'
import Icons from '../Icons/Icons';
import "./PerformanceMetric.scss"
import * as PropTypes from "prop-types";
// variant  -> See propTypes below

const PerformanceMetric = ({ variant, metricIcon, content, metricName, tooltip }) => {

  if (content === "null" || content === null) {
    content = "-"
  }


  const InfoIcon = () => {
    return (
      <div className={'performance-metric'}>
        <div className='metric-content' >{content}</div>
        <div className='info-name-container'>
          {metricName}
          <Tooltip placement='right-end' title={tooltip}>
            <i className="ri-information-line info-icon"></i>
          </Tooltip>
        </div>
      </div>
    )
  }
  const InfoMetricIcon = () => {
    return (
      <div className={'performance-metric'}>
        <div className='metric-content'>{metricIcon}{content}</div>
        <div className='info-name-container'>
          {metricName}
          <Tooltip placement='right-end' title={tooltip}>
            <i className="ri-information-line info-icon"></i>
          </Tooltip>
        </div>
      </div>
    )
  }
  const MetricIcon = () => {
    return (
      <div className={'performance-metric'}>
        <div className='metric-content'>{metricIcon}{content}</div>
        <div className='info-name-container' >{metricName} </div>
      </div>
    )
  }

  const DefaultComp = () => {
    return (
      <div className={'performance-metric'}>
        <div className='metric-content'>{content}</div>
        <div className='info-name-container'>{metricName}</div>
      </div>
    )
  }

  switch (variant) {
    case 'infoIcon':
      return <InfoIcon />
    case 'infoMetricIcon':
      return <InfoMetricIcon />
    case 'metricIcon':
      return <MetricIcon />
    default:
      return <DefaultComp />
  }
}

PerformanceMetric.propTypes = {
    variant: PropTypes.oneOf(['infoIcon', 'infoMetricIcon', 'metricIcon']),
}

export default PerformanceMetric;
