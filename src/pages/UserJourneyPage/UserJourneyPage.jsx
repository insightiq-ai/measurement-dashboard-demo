import React, { useEffect, useState } from "react";
import "./UserJourneyPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import AggregateMetrics from "../../components/UserJourneyComponents/AggregateMetrics/AggregateMetrics";
import { getTotalOrderPerAUID, getUserById, getUserEvents } from "../../api/api";
import { isEmpty } from "../../utils/util";
import UserMetrics from "../../components/UserJourneyComponents/UserMetrics/UserMetrics";
import { Icons } from "../../components";

export default function UserJourneyPage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [userEvents, setUserEvents] = useState([]);
    // Populate these values from the Hasura API
    const [totalOrderValuePerUser, setTotalOrderValuePerUser] = useState(null);
    const [ordersPlaced, setOrdersPlaced] = useState(null);

    useEffect(() => {
        getUserById({ userId }).then(setUser);
        getUserEvents({ userId, limit: 1 }).then(setUserEvents);
        getTotalOrderPerAUID("78224cfe-15d1-4cfa-a4b3-a612625ff557").then((res) => {
            setTotalOrderValuePerUser(!isEmpty(res?.summaries[0].order_total) ? res?.summaries[0].order_total : null);
            setOrdersPlaced(!isEmpty(res?.summaries[0].number_of_orders) ? res?.summaries[0].number_of_orders : null);
        });
    }, [userId]);

    function countUtmMediums(data) {
        const mediumCounts = {
            YouTube: 0,
            TikTok: 0,
            Instagram: 0,
            Twitter: 0,
        };

        data.forEach((item) => {
            const medium = item.utm_medium;
            const normalizedMedium = medium?.toLowerCase();

            if (normalizedMedium === "youtube" || normalizedMedium === "tiktok" || normalizedMedium === "instagram" || normalizedMedium === "twitter") {
                mediumCounts[medium]++;
            } else if (normalizedMedium === "x") {
                mediumCounts["Twitter"]++; // Assuming 'X' counts as 'Twitter' based on previous context
            }
        });

        return mediumCounts;
    }

    function splitOrderValueByMedium(data, totalOrderValue) {
        const mediumCounts = countUtmMediums(data);
        const totalCounts = Object.values(mediumCounts).reduce((sum, count) => sum + count, 0);
        const mediumWeights = [];

        const iconMapping = {
            YouTube: <Icons.youtube_demo/>,
            TikTok: <Icons.twitter_demo/>,
            Instagram: <Icons.instagram_demo/>,
            Twitter: <Icons.twitter_demo/>,
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
                    metric: value
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
            <div className={'div-top-container-user-journey'}>
                <AggregateMetrics user={user} userEvents={userEvents[0]}/>
                <UserMetrics
                    user={user}
                    platformSplit={splitOrderValueByMedium(userEvents, totalOrderValuePerUser)}
                    ordersPlaced={ordersPlaced}
                    totalOrderValue={totalOrderValuePerUser}/>
            </div>
        </div>
    );
}
