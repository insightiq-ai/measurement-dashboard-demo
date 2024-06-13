import { CircularProgress } from "@material-ui/core";
import React from "react";
import "./IntermediateLoader.scss";

const IntermediateLoader = ({ content, title }) => {
  return (
    <>
      <div className="light-bg">
        <div className="content-box-home">
          <div className="loader-div">
            <CircularProgress size="48px" className={"circular-progress"} />
            <h2>{title ? title : "Please wait!"}</h2>
            {content}
          </div>
        </div>
      </div>
    </>
  );
};
export default IntermediateLoader;
