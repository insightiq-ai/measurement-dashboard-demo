import React, { useEffect, useState } from 'react';
import './UserJourneyPage.scss';
import { useNavigate, useParams } from "react-router-dom";
import AggregateMetrics from "../../components/UserJourneyComponents/AggregateMetrics/AggregateMetrics";
import { getUserById, getUserEvents } from "../../api/api";
import { formatNumber, currencyFormatter } from "../../utils/util";
import UserMetrics from "../../components/UserJourneyComponents/UserMetrics/UserMetrics";

export default function UserJourneyPage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [userEvents, setUserEvents] = useState(null);
    useEffect(() => {
        getUserById({ userId }).then((res) => {
            console.log(`getUserById`);
            console.log(res);
            setUser(res);
        });
        getUserEvents({ userId, limit: 1 }).then((res) => {
            console.log(`getUserEvents`);
            console.log(res);
            setUserEvents(res?.data[0]);
        });
    }, [userId]);

    return (
        <div className={'div-user-journey-page'}>
            <div className={'div-back-container'}>
                <i className="ri-arrow-left-line back-icon" onClick={() => {
                    navigate(-1);
                }}></i>
            </div>
            <div className={'div-top-container-user-journey'}>
                <AggregateMetrics user={user} userEvents={userEvents}/>
                <UserMetrics user={user} userEvents={userEvents} ordersPlaced={formatNumber(1000)}
                             totalOrderValue={currencyFormatter.format(1029)}/>
            </div>
        </div>
    )

}
