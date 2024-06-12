import React, { useEffect, useState } from 'react';
import './PerformancePage.scss';
import PageMetrics from "../../components/PageMetrics/PageMetrics";
import { TabSwitch } from "../../components";
import { SUMMARY, UTM_LINKS } from "../../utils/constants";
import TabPanel from "../../components/TabSwitch/TabPanel";
import { getAttributionStatistics, getDashboardLinkMetrics, getPromocodeAnalytics } from "../../api/api";
import { percentFormatter, currencyFormatter, formatNumber, isEmpty } from "../../utils/util";

export default function PerformancePage(props) {
    const [analytics, setAnalytics] = useState(null);
    const [attributionStatistics, setAttributionStatistics] = useState(null);
    const [dashboardLinkMetrics, setDashboardLinkMetrics] = useState(null);
    const TOTAL_CREATOR_COST = 2000;
    const NUMBER_OF_CREATORS = 3;

    useEffect(() => {
        getPromocodeAnalytics({ storeId: '671ade3e-133b-4bcb-932e-a81321e9cc83' }).then((res) => {
            console.log(`getPromocodeAnalytics`);
            console.log(res);
            setAnalytics(res);
        });

        getAttributionStatistics().then((res) => {
            console.log(`getAttributionStatistics`);
            console.log(res);
            setAttributionStatistics(res);
        });

        getDashboardLinkMetrics().then((res) => {
            console.log(`getDashboardLinkMetrics`);
            console.log(res);
            setDashboardLinkMetrics(res);
        });
        //
        // getUsers().then((res) => {
        //     console.log(`getUsers`);
        //     console.log(res);
        // });
        //
        // getUserById({ userId: 'ec46c10a-42ac-4949-a9bd-33c0a56f7a62' }).then((res) => {
        //     console.log(`getUserById`);
        //     console.log(res);
        // });
        //
        // getUserEvents({ userId: 'ec46c10a-42ac-4949-a9bd-33c0a56f7a62' }).then((res) => {
        //     console.log(`getUserEvents`);
        //     console.log(res);
        // });
    }, []);
    const [currentTab, setCurrentTab] = useState(SUMMARY);
    const tabs = [
        {
            label: SUMMARY,
        },
        {
            label: UTM_LINKS,
        },
    ];

    // Calculations - Summary
    const { order_summary } = analytics || {};
    const totalSales = order_summary ? order_summary.total_orders_amount_fulfilled : null;
    const totalCreatorCost = TOTAL_CREATOR_COST;
    const averageCreatorCost = totalCreatorCost / NUMBER_OF_CREATORS;
    const totalRoi = (totalCreatorCost !== 0) ? totalSales / totalCreatorCost : null;
    const totalEventsCaptured = attributionStatistics ? attributionStatistics.number_of_events : null;
    const totalOrders = !isEmpty(order_summary) ? order_summary.total_orders : null;
    const totalUsers = !isEmpty(attributionStatistics) ? attributionStatistics.number_of_users : null;
    const averageEventsPerUser = (!isEmpty(totalUsers) && totalUsers !== 0) ? totalEventsCaptured / totalUsers : null;
    const averageOrdersPerUser = (!isEmpty(totalUsers) && totalUsers !== 0) ? totalOrders / totalUsers : null;
    const averageSalesPerUser = (!isEmpty(totalUsers) && totalUsers !== 0) ? totalSales / totalUsers : null;

    // Calculations - UTM Links
    const totalLinkClicks = !isEmpty(dashboardLinkMetrics) ? dashboardLinkMetrics.total_clicks : null;
    const landingPageViews = attributionStatistics ? attributionStatistics.number_of_sessions : null;
    const clickThroughRate = (!isEmpty(landingPageViews) && landingPageViews !== 0) ? totalLinkClicks / landingPageViews : null;
    const costPerLpv = (!isEmpty(totalCreatorCost) && totalCreatorCost !== 0) ? totalCreatorCost / landingPageViews : null;

    return (
        <div className={'div-performance-page'}>
            <section className={'section-metrics'}>
                <div className={'div-page-title'}>
                    <span className={'section-heading'}>Performance</span>
                    <TabSwitch
                        tabs={tabs}
                        currentTab={currentTab}
                        handleTabChange={(event, newTab) => {
                            setCurrentTab(newTab);
                        }}
                        height={40}
                        width={224}
                    />
                </div>


                <div>
                    <TabPanel index={SUMMARY} value={currentTab}>
                        <PageMetrics
                            leftMetrics={{
                                mainMetric: {
                                    value: !isEmpty(totalRoi) ? percentFormatter.format(totalRoi) : '-',
                                    title: 'Total ROI'
                                },
                                subMetrics: [{
                                    icon: <i className="ri-money-dollar-circle-line metric-icon"></i>,
                                    value: !isEmpty(totalSales) ? currencyFormatter.format(totalSales) : '-',
                                    name: 'Total Sales',
                                    subtitle: `${!isEmpty(averageSalesPerUser) ? currencyFormatter.format(averageSalesPerUser) : '-'} average sales per user`,
                                    tooltip: 'Total revenue generated by the company'
                                }, {
                                    icon: <i className="ri-money-dollar-circle-line metric-icon"></i>,
                                    value: currencyFormatter.format(totalCreatorCost),
                                    name: 'Total creator cost',
                                    subtitle: `${!isEmpty(averageCreatorCost) ? currencyFormatter.format(averageCreatorCost) : '-'} average creator cost`,
                                    tooltip: 'Total sales generated by the company'
                                }]
                            }}
                            rightMetrics={[{
                                icon: <i className="ri-money-dollar-circle-line metric-icon"></i>,
                                value: !isEmpty(totalEventsCaptured) ? formatNumber(totalEventsCaptured) : '-',
                                name: 'Total events captured',
                                subtitle: `${!isEmpty(averageEventsPerUser) ? formatNumber(averageEventsPerUser) : '-'} average events per user`,
                                tooltip: 'Total revenue generated by the company'
                            }, {
                                icon: <i className="ri-money-dollar-circle-line metric-icon"></i>,
                                value: !isEmpty(totalOrders) ? formatNumber(totalOrders) : '-',
                                name: 'Total orders',
                                subtitle: `${!isEmpty(averageOrdersPerUser) ? formatNumber(averageOrdersPerUser) : '-'} average orders per user`,
                                tooltip: 'Total sales generated by the company'
                            }, {
                                icon: <i className="ri-money-dollar-circle-line metric-icon"></i>,
                                value: !isEmpty(totalUsers) ? totalUsers : '-',
                                name: 'Total users',
                                tooltip: 'Total sales generated by the company'
                            }]}
                        />
                    </TabPanel>
                    <TabPanel index={UTM_LINKS} value={currentTab}>
                        {/*<p>{totalLinkClicks}</p>*/}
                        {/*<p>{landingPageViews}</p>*/}
                        {/*<p>{clickThroughRate}</p>*/}
                        {/*<p>{costPerLpv}</p>*/}
                    </TabPanel>

                </div>
            </section>
        </div>
    );
}
