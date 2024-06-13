import React from "react";
import './SplitIcon.scss';
import {currencyFormatter} from "../../../utils/util";

export default function SplitIcon({icon, title, metric}) {
    return (
        <div className={'div-split-icon'}>
            <div className={'div-split-icon-left'} style={{width: 48, height: 48}}>
                {icon}
            </div>
            <div className={'div-split-icon-right'}>
                <span className={'body-r color-neutrals-primary-grey'}>{title}</span>
                <span className={'section-heading color-neutrals-primary-grey'}>{metric === '-' ? '-' : currencyFormatter.format(metric)}</span>
            </div>
        </div>
    );
}
