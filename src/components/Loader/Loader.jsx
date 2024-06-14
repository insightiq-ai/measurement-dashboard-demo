import React from "react";
import "./Loader.scss";
import Icons from "../Icons/Icons";

export default function Loader({
  loading = true,
  children,
  className = "",
  ...otherProps
}) {
  if (!loading) {
    return null;
  }
  return (
    <div className={"loader-container " + className} {...otherProps}>
      <Icons.circular_loader className="loader-icon" />
    </div>
  );
}
