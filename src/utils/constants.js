import { Icons } from "../components";
import React from "react";
import { currencyFormatter } from "./util";

export const SUMMARY = "Summary";
export const UTM_LINKS = "UTM links";
export const ALL_USERS = "All users";
export const CREATORS = "Creators";

export const TOTAL_CREATOR_COST = 2000;
export const YouTube = "YouTube";
export const TikTok = "TikTok";
export const Instagram = "Instagram";
export const Twitter = "Twitter";

export const CREATOR_AAKASH = "Aakash Mehta";
export const CREATOR_DHRUV = "Dhruv Kapuria";
export const CREATOR_MIKE = "Mike Lee";

export const CREATOR_SPLIT = [
  { icon: <Icons.dhruv_demo />, key: "CREATOR_DHRUV", title: CREATOR_DHRUV, cost: TOTAL_CREATOR_COST / 2 },
  { icon: <Icons.aakash_demo />, key: "CREATOR_AAKASH", title: CREATOR_AAKASH, cost: TOTAL_CREATOR_COST / 4 },
  { icon: <Icons.mike_demo />, key: "CREATOR_MIKE", title: CREATOR_MIKE, cost: TOTAL_CREATOR_COST / 4 },
];

export const iconMapping = {
  YouTube: <Icons.youtube_demo />,
  TikTok: <Icons.tiktok_demo />,
  Instagram: <Icons.instagram_demo />,
  Twitter: <Icons.twitter_demo />,
};

const creatorToPlatformMapping = {};
creatorToPlatformMapping[CREATOR_AAKASH] = [YouTube, TikTok];
creatorToPlatformMapping[CREATOR_DHRUV] = [Instagram];
creatorToPlatformMapping[CREATOR_MIKE] = [Twitter];

const creatorToLinkIdMapping = {};
creatorToLinkIdMapping[CREATOR_AAKASH] = [process.env.REACT_APP_EXTERNAL_LINK_ID_1, process.env.REACT_APP_EXTERNAL_LINK_ID_2];
creatorToLinkIdMapping[CREATOR_DHRUV] = [process.env.REACT_APP_EXTERNAL_LINK_ID_3];
creatorToLinkIdMapping[CREATOR_MIKE] = [process.env.REACT_APP_EXTERNAL_LINK_ID_4];

const creatorToPromocodeMapping = {};
creatorToPromocodeMapping[CREATOR_AAKASH] = [process.env.REACT_APP_PROMOCODE_1, process.env.REACT_APP_PROMOCODE_2];
creatorToPromocodeMapping[CREATOR_DHRUV] = [process.env.REACT_APP_PROMOCODE_3];
creatorToPromocodeMapping[CREATOR_MIKE] = [process.env.REACT_APP_PROMOCODE_4];

const platformToCreatorMapping = {};
platformToCreatorMapping[YouTube] = ["CREATOR_AAKASH"];
platformToCreatorMapping[TikTok] = ["CREATOR_AAKASH"];
platformToCreatorMapping[Instagram] = ["CREATOR_DHRUV"];
platformToCreatorMapping[Twitter] = ["CREATOR_MIKE"];

export { creatorToLinkIdMapping, creatorToPromocodeMapping, creatorToPlatformMapping, platformToCreatorMapping };
