import React, { useEffect, useState } from "react";
import "./UserJourneyPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import AggregateMetrics from "../../components/UserJourneyComponents/AggregateMetrics/AggregateMetrics";
import { getTotalOrderPerAUID, getUserById, getUserEvents } from "../../api/api";
import { isEmpty } from "../../utils/util";
import UserMetrics from "../../components/UserJourneyComponents/UserMetrics/UserMetrics";
import { EventJourney } from "../../components";
import InvertedPrimaryButton from "../../components/InvertedPrimaryButton/InvertedPrimaryButton";
import IntermediateLoader from "../../components/IntermediateLoader/IntermediateLoader";
import { iconMapping } from "../../utils/constants";
import { currencyFormatter, formatNumber } from "../../utils/util";

export default function UserJourneyPage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [userEvents, setUserEvents] = useState([]);
    // Populate these values from the Hasura API
    const [totalOrderValuePerUser, setTotalOrderValuePerUser] = useState(null);
    const [ordersPlaced, setOrdersPlaced] = useState(null);
    const [countOfFetchedRecords, setCountOfFetchedRecords] = useState(0);
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        getUserById({ userId }).then(setUser);
        getUserEvents({ userId, limit: 10, offset }).then((result) => {
            setUserEvents(result);
            setCountOfFetchedRecords(result.length);
        });
        getTotalOrderPerAUID(userId).then((res) => {
            if (isEmpty(res?.summaries)) {
                return;
            }
            setTotalOrderValuePerUser(!isEmpty(res?.summaries[0]?.order_total) ? res?.summaries[0]?.order_total : 0);
            setOrdersPlaced(!isEmpty(res?.summaries[0]?.number_of_orders) ? res?.summaries[0]?.number_of_orders : 0);
        });
        setTimeout(() => setIsLoading(false), 1000);
    }, [userId, offset]);

    function countUtmMediums(data) {
        const mediumCounts = {
            YouTube: 0,
            TikTok: 0,
            Instagram: 0,
            Twitter: 0,
            Facebook: 0,
        };

        data.forEach((item) => {
            const medium = item.utm_medium;
            const normalizedMedium = medium?.toLowerCase();

            if (normalizedMedium === "youtube" || normalizedMedium === "tiktok" || normalizedMedium === "instagram" || normalizedMedium === "twitter" || normalizedMedium === "facebook") {
                mediumCounts[medium]++;
            } else if (normalizedMedium === "x") {
                mediumCounts["Twitter"]++; // Assuming 'X' counts as 'Twitter' based on previous context
            } else if (normalizedMedium === "meta") {
                mediumCounts["Facebook"]++; // Assuming 'X' counts as 'Twitter' based on previous context
            }
        });

        return mediumCounts;
    }

    function splitOrderValueByMedium(data, totalOrderValue) {
        const mediumCounts = countUtmMediums(data);
        const totalCounts = Object.values(mediumCounts).reduce((sum, count) => sum + count, 0);
        const mediumWeights = [];

        for (const medium in mediumCounts) {
            if (totalCounts === 0) {
                mediumWeights.push({
                    icon: iconMapping[medium],  // Map the medium to its corresponding icon
                    title: medium,
                    metric: '-'
                });
            } else {
                // Calculate the proportion of each medium
                const value = (mediumCounts[medium] / totalCounts) * totalOrderValue;
                mediumWeights.push({
                    icon: iconMapping[medium],  // Map the medium to its corresponding icon
                    title: medium,
                    metric: value || '-'
                });
            }
        }

        return mediumWeights;
    }

    if (isLoading)
        return (
            <div className="loader-container" style={{ height: "100vh", width: "100vw" }}>
                <IntermediateLoader/>
            </div>
        );

    return (
        <div className="div-user-journey-parent-container">
            <div className={"div-user-journey-page"}>
                <div className={"div-back-container"}>
                    <i
                        className="ri-arrow-left-line back-icon"
                        onClick={() => {
                            navigate(-1);
                        }}
                    ></i>
                </div>
                {userEvents?.length > 0 && (
                    <div className={"div-top-container-user-journey"}>
                        <div className={'title'} style={{
                            display: "flex",
                            gap: "24px",
                        }}>{`Hello, ${userId}`}</div>
                        <AggregateMetrics user={user} userEvents={userEvents[0]}/>
                        <UserMetrics
                            user={user}
                            platformSplit={splitOrderValueByMedium(userEvents, totalOrderValuePerUser)}
                            ordersPlaced={isEmpty(ordersPlaced) || ordersPlaced === 0 ? '-' : formatNumber(ordersPlaced)}
                            totalOrderValue={isEmpty(totalOrderValuePerUser) || totalOrderValuePerUser === 0 ? '-' : currencyFormatter.format(totalOrderValuePerUser)}
                        />
                    </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
                    <span className="event-journey-header">Your event journey</span>
                    <EventJourney userEvents={userEvents}/>
                </div>
            </div>
            {countOfFetchedRecords >= 10 && (
                <InvertedPrimaryButton
                    label={"Load more results"}
                    onClick={() => {
                        setOffset((prevOffset) => prevOffset + 10);
                    }}
                    className="table-load-more-button"
                />
            )}
        </div>
    );
}
