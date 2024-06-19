import { Icons } from "../../components";
import "./EventJourney.scss";
import { convertTimeToLocale, isEmpty } from "../../utils/util";

function ListComponent({ userEvent, isLastItem }) {
    // TODO: Add dynamic creator mapping from utm_source
    const CREATOR_AAKASH = "Aakash Mehta";
    const CREATOR_DHRUV = "Dhruv Kapuria";
    const CREATOR_MIKE = "Mike Lee";

    const platformToCreatorMapping = {};
    platformToCreatorMapping["YouTube"] = { name: CREATOR_AAKASH, icon: <Icons.aakash_demo/> };
    platformToCreatorMapping["TikTok"] = { name: CREATOR_AAKASH, icon: <Icons.aakash_demo/> };
    platformToCreatorMapping["Instagram"] = { name: CREATOR_DHRUV, icon: <Icons.dhruv_demo/> };
    platformToCreatorMapping["Twitter"] = { name: CREATOR_MIKE, icon: <Icons.mike_demo/> };

    const isCreatorPresent = userEvent.utm_source ?? false;
    const affiliateCreator = isCreatorPresent ? platformToCreatorMapping[userEvent.utm_medium].name : "Sam Kolder";
    const affliateCreatorIcon = isCreatorPresent ? platformToCreatorMapping[userEvent.utm_medium].icon :
        <Icons.users_icon/>;
    const storeLink = !isEmpty(userEvent.window_location) ? userEvent.window_location : "-";
    const deviceDetails = userEvent.device_details.device ?? "-";
    const browser = userEvent.device_details.browser ?? "-";
    const { event_source } = userEvent;
    // if (event_source === "PROMOCODES") {
    //     return <span>Hello</span>
    // }

    const eventTimeStamp = !isEmpty(userEvent?.event_timestamp) ? convertTimeToLocale(userEvent?.event_timestamp) : "-";
    return (
        <div className="list-parent-container">
            {isCreatorPresent ? (
                <div className="affiliate-header">
                    {affliateCreatorIcon}
                    <span>Affiliated to {affiliateCreator}</span>
                </div>
            ) : null}
            {event_source === 'PROMOCODES' ?
                <div>
                    <span className="no-wrap-link">
                        {'Custom promocode was applied to an order on store'}
                                            <a href={storeLink} target="_blank" className="link-container">
                            {'Demo Shoes'}
                        </a>
                        <Icons.link_to_icon/>
                    </span>

                </div> :
                <div className="affiliate-info-parent-container">
                    <div className="affiliate-info-container">
                        <div className="store-icon-container">
                            <Icons.demoshoes />

                        </div>
                        <div className="affiliate-store-details">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                }}
                            >
                                <a href={storeLink} target="_blank" className="link-container">
                                    {storeLink}
                                </a>
                                <Icons.link_to_icon/>
                            </div>
                            <div className="affiliate-device-details">
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Icons.smartphone_line/>
                                    <span>{deviceDetails}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    {browser === "Safari" ? <Icons.safari/> : <Icons.chrome/>}
                                    <span>{browser}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span>{eventTimeStamp}</span>
                </div>}
            {!isLastItem && <div className="line-break"/>}
        </div>
    );
}

export default function EventJourney({ userEvents }) {
    return (
        <div className="event-journey-list-container">
            {userEvents && userEvents.map((userEvent, index) => <ListComponent userEvent={userEvent} isLastItem={index === userEvents.length - 1}/>)}
        </div>
    );
}
