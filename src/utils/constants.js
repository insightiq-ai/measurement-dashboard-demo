import { Icons } from "../components";
import React from "react";
import {currencyFormatter} from './util'

export const SUMMARY = 'Summary';
export const UTM_LINKS = 'UTM links';
export const ALL_USERS = 'All users';
export const CREATORS = 'Creators';

export const TOTAL_CREATOR_COST = 2000;
export const NUMBER_OF_CREATORS = 3;

export const CREATOR_AAKASH = 'Aakash';
export const CREATOR_DHRUV = 'Dhruv';
export const CREATOR_MIKE = 'Mike';

export const CREATOR_SPLIT = [
    { icon: <Icons.dhruv_demo/>, title: CREATOR_DHRUV, metric: TOTAL_CREATOR_COST / 2 },
    { icon: <Icons.aakash_demo/>, title: CREATOR_AAKASH, metric:  TOTAL_CREATOR_COST / 4 },
    { icon: <Icons.mike_demo/>, title: CREATOR_MIKE, metric:  TOTAL_CREATOR_COST / 4 }
];

export const iconMapping = {
    YouTube: <Icons.youtube_demo/>,
    TikTok: <Icons.tiktok_demo/>,
    Instagram: <Icons.instagram_demo/>,
    Twitter: <Icons.twitter_demo/>,
    Facebook: <Icons.facebook_demo/>
};
