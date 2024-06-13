import React from 'react';
import './UserJourneyPage.scss';
import { useNavigate, useParams } from "react-router-dom";
import AggregateMetrics from "../../components/UserJourneyComponents/AggregateMetrics/AggregateMetrics";

export default function UserJourneyPage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    return (
        <div className={'div-user-journey-page'}>
            <div className={'div-back-container'}>
                <i className="ri-arrow-left-line back-icon" onClick={() => {
                    navigate(-1);
                }}></i>
            </div>
            <div className={'div-top-container-user-journey'}>
                <AggregateMetrics userId={userId}/>
                <p>hhehe</p>
            </div>
        </div>
    )

}
