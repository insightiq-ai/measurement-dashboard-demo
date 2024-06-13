import React from "react";
import "./InvertedPrimaryButton.scss";
import Loader from "../Loader/Loader";

export default function InvertedPrimaryButton({ label, className = "", icon, loading = false, ...otherProps }) {
  return (
    <button type="primary" className={`inverted-button-container ${className}`} {...otherProps}>
      <>
        {loading && <Loader />}
        {icon}
        {label}
      </>
    </button>
  );
}

InvertedPrimaryButton.defaultProps = {
  className: "InvertedPrimaryButton",
  onClick: () => {},
};
