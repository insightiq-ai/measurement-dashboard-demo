import React, { useEffect, useState } from "react";
import "./UserJourneyPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import AggregateMetrics from "../../components/UserJourneyComponents/AggregateMetrics/AggregateMetrics";
import { getTotalOrderPerAUID, getUserById, getUserEvents } from "../../api/api";
import { currencyFormatter, formatNumber, isEmpty } from "../../utils/util";
import UserMetrics from "../../components/UserJourneyComponents/UserMetrics/UserMetrics";
import { EventJourney, Icons } from "../../components";
import InvertedPrimaryButton from "../../components/InvertedPrimaryButton/InvertedPrimaryButton";
import IntermediateLoader from "../../components/IntermediateLoader/IntermediateLoader";
import { iconMapping, platformToCreatorMapping } from "../../utils/constants";

export default function UserJourneyPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [allUserEvents, setAllUserEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  // Populate these values from the Hasura API
  const [totalOrderValuePerUser, setTotalOrderValuePerUser] = useState(null);
  const [ordersPlaced, setOrdersPlaced] = useState(null);
  const [offset, setOffset] = useState(0);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserById({ userId }).then(setUser);
    getUserEvents({ userId, limit: 100 }).then((result) => {
      if (!isEmpty(result)) {
        setAllUserEvents(result);
      }
    });
    getTotalOrderPerAUID(userId).then((res) => {
      if (isEmpty(res?.summaries)) {
        return;
      }
      setTotalOrderValuePerUser(!isEmpty(res?.summaries[0]?.order_total) ? res?.summaries[0]?.order_total : 0);
      setOrdersPlaced(!isEmpty(res?.summaries[0]?.number_of_orders) ? res?.summaries[0]?.number_of_orders : 0);
    });
  }, [userId]);

  useEffect(() => {
    getUserEvents({ userId, limit: 10, offset }).then((result) => {
      if (!isEmpty(result)) {
        if (result.length === 10) setShowLoadMore(true);
        else setShowLoadMore(false);
        setUserEvents((prevResult) => [...prevResult, ...result]);
      } else setShowLoadMore(false);
    });
    setTimeout(() => setIsLoading(false), 1000);
  }, [userId, offset]);

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

        for (const medium in mediumCounts) {
            if (totalCounts === 0) {
                mediumWeights.push({
                    icon: iconMapping[medium], // Map the medium to its corresponding icon
                    title: medium,
                    metric: "-",
                });
            } else {
                // Calculate the proportion of each medium
                const value = (mediumCounts[medium] / totalCounts) * totalOrderValue;
                mediumWeights.push({
                    icon: iconMapping[medium], // Map the medium to its corresponding icon
                    title: medium,
                    metric: value || "-",
                });
            }
        }
        const creatorSplit = {
            CREATOR_DHRUV: 0,
            CREATOR_AAKASH: 0,
            CREATOR_MIKE: 0,
        };
        for (const mediumWeight of mediumWeights) {
            const { title: platform, metric } = mediumWeight;
            if (isNaN(metric) || isEmpty(metric)) {
                continue;
            }
            const creatorsOfPlatform = platformToCreatorMapping[platform];
            creatorsOfPlatform &&
            creatorsOfPlatform.forEach((creatorOfPlatform) => {
                creatorSplit[creatorOfPlatform] += metric / creatorsOfPlatform.length;
            });
        }
        return { platformSplit: mediumWeights, creatorSplit };
    }

  if (isLoading)
    return (
      <div className="loader-container" style={{ height: "100vh", width: "100vw" }}>
        <IntermediateLoader />
      </div>
    );

  const { creatorSplit, platformSplit } = splitOrderValueByMedium(allUserEvents, totalOrderValuePerUser);

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
        <div className={"div-top-container-user-journey"}>
          <div
            className={"title"}
            style={{
              display: "flex",
              gap: "24px",
              alignItems: "center",
            }}
          >
            <Icons.avatar1_demo />
            {`Hello, ${userId}`}
          </div>
          <AggregateMetrics user={user} userEvents={allUserEvents} />
          <UserMetrics
            user={user}
            platformSplit={platformSplit}
            creatorSplit={creatorSplit}
            ordersPlaced={isEmpty(ordersPlaced) || ordersPlaced === 0 ? "-" : formatNumber(ordersPlaced)}
            totalOrderValue={isEmpty(totalOrderValuePerUser) || totalOrderValuePerUser === 0 ? "-" : currencyFormatter.format(totalOrderValuePerUser)}
          />
        </div>
        {!isEmpty(userEvents) ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            <span className="event-journey-header">Your event journey</span>
            <div className="div-user-journey-box">
              <EventJourney userEvents={userEvents} />
            </div>
          </div>
        ) : null}
      </div>
      {showLoadMore && (
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
