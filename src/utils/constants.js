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
    { icon: <Icons.youtube_demo/>, title: CREATOR_DHRUV, metric: TOTAL_CREATOR_COST / 2 },
    { icon: <Icons.instagram_demo/>, title: CREATOR_AAKASH, metric:  TOTAL_CREATOR_COST / 4 },
    { icon: <Icons.twitter_demo/>, title: CREATOR_MIKE, metric:  TOTAL_CREATOR_COST / 4 }
];
