import { useEffect } from "react";
import { Icons } from "../../components";
import "./EventJourney.scss";
import { isEmpty, convertTimeToLocale } from "../../utils/util";

const ListComponent = ({ userEvent }) => {
  // TODO: Add dynamic creator mapping from utm_source
  const isCreatorPresent = userEvent.utm_source ?? false;
  const storeLink = !isEmpty(userEvent.window_location) ? userEvent.window_location : "-";
  const deviceDetails = userEvent.device_details.device ?? "iPhone 15";
  const browser = userEvent.device_details.browser ?? "Chrome";
  const eventTimeStamp = !isEmpty(userEvent?.event_timestamp) ? convertTimeToLocale(userEvent?.event_timestamp) : "-";
  return (
    <div className="list-parent-container">
      {isCreatorPresent ? (
        <div className="affiliate-header">
          <Icons.users_icon />
          <span>Affiliated to Sam Kolder</span>
        </div>
      ) : null}
      <div className="affiliate-info-parent-container">
        <div className="affiliate-info-container">
          <div>
            <Icons.youtube_demo />
          </div>
          <div className="affiliate-store-details">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <a href="">{storeLink}</a>
              <Icons.link_to_icon />
            </div>
            <div className="affiliate-device-details">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.smartphone_line />
                <span>{deviceDetails}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.chrome />
                <span>{browser}</span>
              </div>
            </div>
          </div>
        </div>
        <span>{eventTimeStamp}</span>
      </div>
      <div className="line-break" />
    </div>
  );
};

export default function EventJourney({ userEvents }) {
  return (
    <div className="event-journey-list-container">{userEvents && userEvents.map((userEvent, index) => <ListComponent userEvent={userEvent} />)}</div>
  );
}
