import { useEffect } from "react";
import { Icons } from "../../components";
import "./EventJourney.scss";
const ListComponent = ({ isCreatorPresent = false }) => {
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
              <a href="">Redesyn Store | Collection | Kurta set</a>
              <Icons.link_to_icon />
            </div>
            <div className="affiliate-device-details">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.smartphone_line />
                <span>iPhone 15</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.chrome />
                <span>Chrome</span>
              </div>
            </div>
          </div>
        </div>
        <span>Time</span>
      </div>
      <div className="line-break" />
    </div>
  );
};

export default function EventJourney() {
  useEffect(() => {}, []);
  return (
    <div className="event-journey-list-container">
      <ListComponent isCreatorPresent={true} />
      <ListComponent />
      <ListComponent />
      <ListComponent />
      <ListComponent isCreatorPresent={true} />
    </div>
  );
}
