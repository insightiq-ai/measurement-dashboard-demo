import { Icons } from "../components";
import React from "react";
import {currencyFormatter} from './util'

export const SUMMARY = 'Summary';
export const UTM_LINKS = 'UTM links';

export const TOTAL_CREATOR_COST = 2000;
export const NUMBER_OF_CREATORS = 3;

export const CREATOR_SPLIT = [
    { icon: <Icons.youtube_demo/>, title: 'Aakash', metric: currencyFormatter.format(TOTAL_CREATOR_COST / 2) },
    { icon: <Icons.instagram_demo/>, title: 'Dhruv', metric: currencyFormatter.format(TOTAL_CREATOR_COST / 4) },
    { icon: <Icons.twitter_demo/>, title: 'Mike', metric: currencyFormatter.format(TOTAL_CREATOR_COST / 4) }
];
