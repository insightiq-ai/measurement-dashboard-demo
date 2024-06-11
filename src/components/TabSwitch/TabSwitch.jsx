import React from "react";
import { Tab, Tabs } from "@mui/material";
import "./TabSwitch.scss";

const TabSwitch = ({ currentTab, handleTabChange, tabs, height, width, isPaddingRequired = false, variant, handleTabClick = () => {} }) => {
  if (!currentTab || !tabs) return;

  const UnderlineTabSwitch = () => {
    return (
      <div className={`underline-tab-container ${isPaddingRequired ? "padding" : ""}`}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="icon position tabs example"
          sx={{ height: height, width: width, alignItems: "center" }}
          className="underline-tab-switch"
        >
          {tabs.map((tab, index) => {
            return (
              <Tab
                key={index}
                label={
                  <>
                    {tab.icon}
                    {tab.label}
                  </>
                }
                value={tab.label}
                disableRipple
              />
            );
          })}
        </Tabs>
      </div>
    );
  };

  const CircularTabSwitch = () => {
    return (
      <div className={`tab-switch-container ${isPaddingRequired ? "padding" : ""}`}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="icon position tabs example"
          sx={{ height: height, width: width, alignItems: "center" }}
          className="tab-switch"
          onClick={handleTabClick}
        >
          {tabs.map((tab, index) => {
            return (
              <Tab
                key={index}
                label={
                  <>
                    {tab.icon}
                    {tab.label}
                  </>
                }
                value={tab.label}
                disableRipple
              />
            );
          })}
        </Tabs>
      </div>
    );
  };

  switch (variant) {
    case "underline":
      return <UnderlineTabSwitch />;
    default:
      return <CircularTabSwitch />;
  }
};

export default TabSwitch;
