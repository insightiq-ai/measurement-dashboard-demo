import React, { useEffect, useState } from 'react';
import './UserJourneyPage.scss';
import { useNavigate, useParams } from "react-router-dom";
import AggregateMetrics from "../../components/UserJourneyComponents/AggregateMetrics/AggregateMetrics";
import { getUserById, getUserEvents } from "../../api/api";
import { currencyFormatter } from "../../utils/util";
import UserMetrics from "../../components/UserJourneyComponents/UserMetrics/UserMetrics";
import { Icons } from "../../components";
import { TOTAL_CREATOR_COST } from "../../utils/constants";

export default function UserJourneyPage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [userEvents, setUserEvents] = useState(null);
    // Populate these values from the Hasura API
    const [totalOrderValue, setTotalOrderValue] = useState(TOTAL_CREATOR_COST);
    const [ordersPlaced, setOrdersPlaced] = useState(20);

    useEffect(() => {
        getUserById({ userId }).then((res) => {
            console.log(`getUserById`);
            console.log(res);
            setUser(res);
        });
        getUserEvents({ userId, limit: 1 }).then((res) => {
            console.log(`getUserEvents`);
            console.log(res);
            setUserEvents(res?.data);
        });
    }, [userId]);

    // useEffect(() => {
    //     if (userEvents) {
    //         console.log(splitOrderValueByMedium(userEvents, totalOrderValue));
    //     }
    // }, [userEvents]);

    function countUtmMediums(data) {
        const mediumCounts = {
            'YouTube': 0,
            'TikTok': 0,
            'Instagram': 0,
            'Twitter': 0
        };

        data.forEach(item => {
            const medium = item.utm_medium;
            const normalizedMedium = medium?.toLowerCase();

            if (normalizedMedium === 'youtube' ||
                normalizedMedium === 'tiktok' ||
                normalizedMedium === 'instagram' ||
                normalizedMedium === 'twitter') {
                mediumCounts[medium]++;
            } else if (normalizedMedium === 'x') {
                mediumCounts['Twitter']++;  // Assuming 'X' counts as 'Twitter' based on previous context
            }
        });

        return mediumCounts;
    }

    function splitOrderValueByMedium(data, totalOrderValue) {
        const mediumCounts = countUtmMediums(data);
        const totalCounts = Object.values(mediumCounts).reduce((sum, count) => sum + count, 0);
        const mediumWeights = [];

        const iconMapping = {
            'YouTube': <Icons.youtube_demo/>,
            'TikTok': <Icons.twitter_demo/>,
            'Instagram': <Icons.instagram_demo/>,
            'Twitter': <Icons.twitter_demo/>,
        };

        for (const medium in mediumCounts) {
            if (totalCounts === 0) {
                mediumWeights.push({
                    icon: iconMapping[medium],  // Map the medium to its corresponding icon
                    title: medium,
                    metric: '-'  // Optional: rounding the value to keep it clean
                });
            } else {
                // Calculate the proportion of each medium
                const value = (mediumCounts[medium] / totalCounts) * totalOrderValue;
                value > 0 && mediumWeights.push({
                    icon: iconMapping[medium],  // Map the medium to its corresponding icon
                    title: medium,
                    metric: currencyFormatter.format(value)
                });
            }
        }

        return mediumWeights;
    }

    return (
        <div className={'div-user-journey-page'}>
            <div className={'div-back-container'}>
                <i className="ri-arrow-left-line back-icon" onClick={() => {
                    navigate(-1);
                }}></i>
            </div>
            {userEvents?.length > 0 && <div className={'div-top-container-user-journey'}>
                <AggregateMetrics user={user} userEvents={userEvents[0]}/>
                <UserMetrics
                    user={user}
                    platformSplit={splitOrderValueByMedium(userEvents, totalOrderValue)}
                    ordersPlaced={ordersPlaced}
                    totalOrderValue={totalOrderValue}/>
            </div>}
        </div>
    )

}
