import { Icons } from "../components";
import React from "react";
import {currencyFormatter} from './util'

export const SUMMARY = 'Summary';
export const UTM_LINKS = 'UTM links';
export const ALL_USERS = 'All users';
export const CREATORS = 'Creators';

export const TOTAL_CREATOR_COST = 2000;
export const NUMBER_OF_CREATORS = 3;

export const CREATOR_AAKASH = 'Aakash Mehta';
export const CREATOR_DHRUV = 'Dhruv Kapuria';
export const CREATOR_MIKE = 'Mike Lee';

export const CREATOR_SPLIT = [
    { icon: <Icons.dhruv_demo/>, key: 'CREATOR_DHRUV',  title: CREATOR_DHRUV, metric: TOTAL_CREATOR_COST / 2 },
    { icon: <Icons.aakash_demo/>, key: 'CREATOR_AAKASH', title: CREATOR_AAKASH, metric:  TOTAL_CREATOR_COST / 4 },
    { icon: <Icons.mike_demo/>, key: 'CREATOR_MIKE', title: CREATOR_MIKE, metric:  TOTAL_CREATOR_COST / 4 }
];

export const iconMapping = {
    YouTube: <Icons.youtube_demo/>,
    TikTok: <Icons.tiktok_demo/>,
    Instagram: <Icons.instagram_demo/>,
    Twitter: <Icons.twitter_demo/>,
    Facebook: <Icons.facebook_demo/>
};

const creatorToLinkIdMapping = {};
creatorToLinkIdMapping[CREATOR_DHRUV] = [process.env.REACT_APP_EXTERNAL_LINK_ID_1, process.env.REACT_APP_EXTERNAL_LINK_ID_2];
creatorToLinkIdMapping[CREATOR_AAKASH] = [process.env.REACT_APP_EXTERNAL_LINK_ID_3];
creatorToLinkIdMapping[CREATOR_MIKE] = [process.env.REACT_APP_EXTERNAL_LINK_ID_4];

const creatorToPromocodeMapping = {};
creatorToPromocodeMapping[CREATOR_DHRUV] = [process.env.REACT_APP_PROMOCODE_1, process.env.REACT_APP_PROMOCODE_2];
creatorToPromocodeMapping[CREATOR_AAKASH] = [process.env.REACT_APP_PROMOCODE_3];
creatorToPromocodeMapping[CREATOR_MIKE] = [process.env.REACT_APP_PROMOCODE_4];

const creatorToPlatformMapping = {};
creatorToPlatformMapping[CREATOR_DHRUV] = ["YouTube", "TikTok", "Instagram"];
creatorToPlatformMapping[CREATOR_AAKASH] = ["Instagram"];
creatorToPlatformMapping[CREATOR_MIKE] = ["Twitter"];

const platformToCreatorMapping = {};
platformToCreatorMapping["YouTube"] = ['CREATOR_DHRUV'];
platformToCreatorMapping["TikTok"] = ['CREATOR_DHRUV'];
platformToCreatorMapping["Instagram"] = ['CREATOR_AAKASH'];
platformToCreatorMapping["Twitter"] = ['CREATOR_MIKE'];

export function invertMapping(mapping) {
    const platformToCreatorMapping = {};

    // Iterate over each creator in the original mapping
    for (const creator in mapping) {
        const platforms = mapping[creator];

        // Iterate over each platform associated with the creator
        platforms.forEach(platform => {
            if (!platformToCreatorMapping[platform]) {
                platformToCreatorMapping[platform] = []; // Initialize if not already done
            }
            platformToCreatorMapping[platform].push(creator);
        });
    }

    return platformToCreatorMapping;
}

export { creatorToLinkIdMapping, creatorToPromocodeMapping, creatorToPlatformMapping, platformToCreatorMapping };
