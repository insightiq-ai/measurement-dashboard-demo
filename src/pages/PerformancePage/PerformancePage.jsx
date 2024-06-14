import React, { useEffect, useState } from "react";
import "./PerformancePage.scss";
import SummaryMetrics from "../../components/SummaryComponents/SummaryMetrics/SummaryMetrics";
import { TabSwitch } from "../../components";
import { ALL_USERS, CREATORS, iconMapping, SUMMARY, UTM_LINKS } from "../../utils/constants";
import TabPanel from "../../components/TabSwitch/TabPanel";
import {
    getAllOrdersFromShopify,
    getAttributionStatistics,
    getCountOfAbondonedCheckout,
    getCreatorsData,
    getDashboardLinkMetrics,
    getPromocodeAnalytics,
    getUsers,
} from "../../api/api";
import { convertTimeToLocale, currencyFormatter, formatNumber, isEmpty, percentFormatter } from "../../utils/util";
import UtmLinksMetrics from "../../components/UtmLinksComponents/UtmLinksMetrics/UtmLinksMetrics";
import Grid from "../../components/Grid/Grid";
import { Icons } from "../../components";
import { CustomFooter, getSortedHeaderClass } from "../../utils/DataGridUtils";
import { DataGrid } from "@mui/x-data-grid";
import { Colors } from "../../styles/colors";
import { useNavigate } from "react-router-dom";

export default function PerformancePage(props) {
    const [analytics, setAnalytics] = useState(null);
    const [attributionStatistics, setAttributionStatistics] = useState(null);
    const [dashboardLinkMetrics, setDashboardLinkMetrics] = useState(null);
    const [totalOrderCount, setTotalOrderCount] = useState(null);
    const [totalAbondonedCheckouts, setTotalAbondonedCheckouts] = useState(null);
    const navigate = useNavigate();

    const TOTAL_CREATOR_COST = 2000;
    const NUMBER_OF_CREATORS = 3;

    const [currentTab, setCurrentTab] = useState(SUMMARY);
    const tabs = [
        {
            label: SUMMARY,
        },
        {
            label: UTM_LINKS,
        },
    ];
    const tableViewTabs = [
        {
            label: ALL_USERS,
        },
        {
            label: CREATORS,
        },
    ];
    const [tableViewCurrTab, setTableViewCurrTab] = useState(ALL_USERS);

    // Calculations - Summary
    const { order_summary } = analytics || {};
    const totalSales = !isEmpty(order_summary) ? order_summary.total_orders_amount_fulfilled : null;
    const totalCreatorCost = TOTAL_CREATOR_COST;
    const averageCreatorCost = totalCreatorCost / NUMBER_OF_CREATORS;
    const totalRoi = (!isEmpty(totalSales) && totalCreatorCost !== 0) ? totalSales / totalCreatorCost : null;
    const totalEventsCaptured = !isEmpty(attributionStatistics) ? attributionStatistics.number_of_events : null;
    const totalOrders = !isEmpty(order_summary) ? order_summary.total_orders : null;
    const totalUsers = !isEmpty(attributionStatistics) ? attributionStatistics.number_of_users : null;
    const averageEventsPerUser = (!isEmpty(totalEventsCaptured) && !isEmpty(totalUsers) && totalUsers !== 0) ? totalEventsCaptured / totalUsers : null;
    const averageOrdersPerUser = (!isEmpty(totalOrders) && !isEmpty(totalUsers) && totalUsers !== 0) ? totalOrders / totalUsers : null;
    const averageSalesPerUser = (!isEmpty(totalSales) && !isEmpty(totalUsers) && totalUsers !== 0) ? totalSales / totalUsers : null;

    // Calculations - UTM Links
    const totalLinkClicks = !isEmpty(dashboardLinkMetrics) ? dashboardLinkMetrics.total_clicks : null;
    const landingPageViews = !isEmpty(attributionStatistics) ? attributionStatistics.number_of_sessions : null;
    const clickThroughRate = (!isEmpty(totalLinkClicks) &&
        !isEmpty(landingPageViews) &&
        landingPageViews !== 0) ? totalLinkClicks / landingPageViews : null;
    const costPerLpv = (!isEmpty(totalCreatorCost) &&
        !isEmpty(landingPageViews) &&
        landingPageViews !== 0) ? (totalCreatorCost / landingPageViews) : null;
    const addToCarts = (!isEmpty(totalOrderCount) && !isEmpty(totalAbondonedCheckouts)) ?
        totalOrderCount + totalAbondonedCheckouts : null;
    const checkoutsInitiated = totalOrderCount;

    const ROW_HEIGHT = 100;
    const PAGE_SIZE = 10;
    const [isUserGridLoading, setUserGridLoading] = useState(false);
    const [isCreatorGridLoading, setCreatorGridLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalUserRows, setTotalUserRows] = useState(0);
    const [userRows, setUserRows] = useState([]);
    const [totalCreatorRows, setTotalCreatorRows] = useState(0);
    const [creatorRows, setCreatorRows] = useState([]);
    const defaultSortModel = [{ field: "roi", sort: "desc" }];
    const [sortModel, setSortModel] = useState(defaultSortModel);

    useEffect(() => {
        const storeId = process.env.REACT_APP_STORE_ID;
        getPromocodeAnalytics({ storeId }).then(setAnalytics);
        getAttributionStatistics().then(setAttributionStatistics);
        getDashboardLinkMetrics().then(setDashboardLinkMetrics);
        setCreatorGridLoading(true);
        getCreatorsData({ storeId }).then((res) => {
            if (!isEmpty(res)) {
                setCreatorRows(res);
                setTotalCreatorRows(res?.length);
            }
        }).finally(() => {
            setCreatorGridLoading(false);
        });
        getAllOrdersFromShopify().then((res) => {
            setTotalOrderCount(res?.count);
        });
        getCountOfAbondonedCheckout().then((res) => {
            setTotalAbondonedCheckouts(res?.checkouts?.length);
        });
    }, []);

    useEffect(() => {
        setUserGridLoading(true);
        getUsers({
            limit: PAGE_SIZE,
            offset: pageNumber * PAGE_SIZE,
        })
            .then(setUserRows)
            .finally(() => {
                setUserGridLoading(false);
            });
    }, [sortModel, pageNumber]);

    useEffect(() => {
        if (!isEmpty(attributionStatistics)) {
            setTotalUserRows(attributionStatistics.number_of_users);
        }
    }, [attributionStatistics]);

    const commonHeaderProps = {
        flex: 1,
        headerClassName: "subtitle-m mui-data-grid-header hideRightSeparator",
    };

    // Users table
    function renderIdCell(params) {
        let id = '-', icon = null;
        const icons = [
            <Icons.avatar1_demo />,
            <Icons.avatar2_demo />,
            <Icons.avatar3_demo />,
            <Icons.avatar4_demo />,
            <Icons.avatar5_demo />,
        ];
        if (!isEmpty(params.row.id)) {
            id = params.row.id;
            const rowIndex = params.api.getRowIndexRelativeToVisibleRows ? params.api.getRowIndexRelativeToVisibleRows(params.row.id) : 0;
            const iconIndex = rowIndex % icons.length; // Use modulo to cycle through icons
            icon = icons[iconIndex]; // Get the correct icon from the array
        }
        return <span className={'body-b'} style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
        }}>{icon}{id}</span>;
    }

    function renderEventsCell(params) {
        let number_of_events = '-';
        if (!isEmpty(params.row.number_of_events) && params.row.number_of_events !== 0) {
            number_of_events = formatNumber(params.row.number_of_events);
        }
        return <span className={'body-r'}>{number_of_events}</span>;
    }

    function renderDeviceCountCell(params) {
        let number_of_fingerprints = '-';
        if (!isEmpty(params.row.number_of_fingerprints) && params.row.number_of_fingerprints !== 0) {
            number_of_fingerprints = formatNumber(params.row.number_of_fingerprints);
        }
        return <span className={'body-r'}>{number_of_fingerprints}</span>;
    }

    function renderLastActiveCell(params) {
        let updated_at = '-';
        if (!isEmpty(params.row.updated_at)) {
            updated_at = convertTimeToLocale(params.row.updated_at);
        }
        return <span className={'body-r'}>{updated_at}</span>;
        // let date = params.row["event_timestamp"];
        // if (date === undefined) {
        //     date = params.row["updated_at"];
        // }
    }

    const userColumns = [
        {
            ...commonHeaderProps,
            align: "left",
            field: "id",
            headerAlign: "left",
            headerName: "User ID",
            renderCell: renderIdCell,
            sortable: false,
            flex: 1,
        },
        {
            ...commonHeaderProps,
            align: "right",
            field: "number_of_events",
            headerAlign: "right",
            headerName: "Events collected",
            renderCell: renderEventsCell,
            sortable: false,
            flex: 0.5
        },
        {
            ...commonHeaderProps,
            align: "right",
            field: "number_of_fingerprints",
            headerAlign: "right",
            headerName: "Device count",
            renderCell: renderDeviceCountCell,
            sortable: false,
            flex: 0.3
        },
        {
            ...commonHeaderProps,
            align: "right",
            field: "updated_at",
            headerAlign: "right",
            headerName: "Last active on",
            renderCell: renderLastActiveCell,
            // headerClassName: `${commonHeaderProps.headerClassName} ${getSortedHeaderClass(sortModel, 'updated_at')}`,
            sortable: false,
            flex: 0.6
        },
    ];

    // Creators table

    function renderNameCell(params) {
        const { icon, title } = params.row;
        return <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
        }}>
            {icon}
            <span className={'body-b'}>{title}</span>
        </div>
    }

    function renderUtmClicksCell(params) {
        let utm_clicks = '-';
        if (!isEmpty(params.row.utm_clicks) && params.row.utm_clicks !== 0) {
            utm_clicks = formatNumber(params.row.utm_clicks);
        }
        return <span className={'body-r'}>{utm_clicks}</span>;
    }

    function renderCreatorCostCell(params) {
        let creator_cost = '-';
        if (!isEmpty(params.row.creator_cost) && params.row.creator_cost !== 0) {
            creator_cost = currencyFormatter.format(params.row.creator_cost);
        }
        return <span className={'body-r'}>{creator_cost}</span>;
    }

    function renderTotalSalesCell(params) {
        let total_sales = '-';
        if (!isEmpty(params.row.total_sales) && params.row.total_sales !== 0) {
            total_sales = formatNumber(params.row.total_sales);
        }
        return <span className={'body-r'}>{total_sales}</span>;
    }

    function renderRoiCell(params) {
        let roi = '-';
        if (!isEmpty(params.row.roi) && params.row.roi !== 0) {
            roi = formatNumber(params.row.roi);
        }
        return <span className={'body-b color-semantics-primary-success'}>{roi}</span>;
    }

    function renderPlatformsCell(params) {
        const platforms = params.row["platforms"];
        if (isEmpty(platforms)) {
            return <span className={'body-r'}>{'-'}</span>;
        }

        return <div style={{
            display: 'flex',
            gap: 4,
        }}>
            {platforms.map((platform) => iconMapping[platform])}
        </div>;
    }

    const creatorColumns = [
        {
            ...commonHeaderProps,
            align: "left",
            field: "name",
            headerAlign: "left",
            headerName: "Creator name",
            renderCell: renderNameCell,
            sortable: false,
        },
        {
            ...commonHeaderProps,
            align: "right",
            field: "utm_clicks",
            headerAlign: "right",
            headerName: "UTM Clicks",
            renderCell: renderUtmClicksCell,
            headerClassName: `${commonHeaderProps.headerClassName} ${getSortedHeaderClass(sortModel, "utm_clicks")}`,
            sortable: true,
        },
        {
            ...commonHeaderProps,
            align: "right",
            field: "creator_cost",
            headerAlign: "right",
            headerName: "Creator cost",
            renderCell: renderCreatorCostCell,
            headerClassName: `${commonHeaderProps.headerClassName} ${getSortedHeaderClass(sortModel, "creator_cost")}`,
            sortable: true,
        },
        {
            ...commonHeaderProps,
            align: "right",
            field: "total_sales",
            headerAlign: "right",
            headerName: "Total Sales",
            renderCell: renderTotalSalesCell,
            headerClassName: `${commonHeaderProps.headerClassName} ${getSortedHeaderClass(sortModel, "total_sales")}`,
            sortable: true,
        },
        {
            ...commonHeaderProps,
            align: "right",
            field: "roi",
            headerAlign: "right",
            headerName: "ROI",
            renderCell: renderRoiCell,
            headerClassName: `${commonHeaderProps.headerClassName} ${getSortedHeaderClass(sortModel, "roi")}`,
            sortable: true,
        },
        {
            ...commonHeaderProps,
            align: "right",
            field: "platforms",
            headerAlign: "right",
            headerName: "Platforms",
            renderCell: renderPlatformsCell,
            // headerClassName: `${commonHeaderProps.headerClassName} ${getSortedHeaderClass(sortModel, 'updated_at')}`,
            sortable: false,
        },
    ];
    const allowedSorts = ["desc", "asc"];

    return (
        <div className={"div-performance-page"}>
            <div className={"section-metrics"}>
                <div className={"div-page-title"}>
                    <span className={"section-heading"}>Performance</span>
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
                        <SummaryMetrics
                            leftMetrics={{
                                mainMetric: {
                                    value: !isEmpty(totalRoi) ? percentFormatter.format(totalRoi) : "-",
                                    title: "Total ROI",
                                },
                                subMetrics: [
                                    {
                                        icon: <i className="ri-money-dollar-circle-line metric-icon"></i>,
                                        value: !isEmpty(totalSales) ? currencyFormatter.format(totalSales) : "-",
                                        name: "Total Sales",
                                        subtitle: `${!isEmpty(averageSalesPerUser) ? currencyFormatter.format(averageSalesPerUser) : "-"} average sales per user`,
                                        tooltip: "Total revenue generated by the company",
                                    },
                                    {
                                        icon: <i className="ri-money-dollar-circle-line metric-icon"></i>,
                                        value: currencyFormatter.format(totalCreatorCost),
                                        name: "Total creator cost",
                                        subtitle: `${!isEmpty(averageCreatorCost) ? currencyFormatter.format(averageCreatorCost) : "-"} average creator cost`,
                                        tooltip: "Total sales generated by the company",
                                    },
                                ],
                            }}
                            rightMetrics={[
                                {
                                    icon: <i className="ri-money-dollar-circle-line metric-icon"></i>,
                                    value: !isEmpty(totalEventsCaptured) ? formatNumber(totalEventsCaptured) : "-",
                                    name: "Total events captured",
                                    subtitle: `${!isEmpty(averageEventsPerUser) ? formatNumber(averageEventsPerUser) : "-"} average events per user`,
                                    tooltip: "Total revenue generated by the company",
                                },
                                {
                                    icon: <i className="ri-money-dollar-circle-line metric-icon"></i>,
                                    value: !isEmpty(totalOrders) ? formatNumber(totalOrders) : "-",
                                    name: "Total orders",
                                    subtitle: `${!isEmpty(averageOrdersPerUser) ? formatNumber(averageOrdersPerUser) : "-"} average orders per user`,
                                    tooltip: "Total sales generated by the company",
                                },
                                {
                                    icon: <i className="ri-money-dollar-circle-line metric-icon"></i>,
                                    value: !isEmpty(totalUsers) ? totalUsers : "-",
                                    name: "Total users",
                                    tooltip: "Total sales generated by the company",
                                },
                            ]}
                        />
                    </TabPanel>
                    <TabPanel index={UTM_LINKS} value={currentTab}>
                        <UtmLinksMetrics
                            leftMetrics={{
                                mainMetric: {
                                    value: !isEmpty(clickThroughRate) ? percentFormatter.format(clickThroughRate) : "-",
                                    title: "CTR (Click Through Rate)",
                                },
                                subMetrics: [
                                    {
                                        icon: <i className="ri-money-dollar-circle-line metric-icon"></i>,
                                        value: !isEmpty(costPerLpv) ? currencyFormatter.format(costPerLpv) : "-",
                                        name: "Cost per LPV",
                                        subtitle: `${!isEmpty(averageSalesPerUser) ? currencyFormatter.format(averageSalesPerUser) : "-"} average sales per user`,
                                    },
                                ],
                            }}
                            rightMetrics={[
                                {
                                    icon: <i className="ri-eye-line ri-xl"></i>,
                                    value: !isEmpty(totalLinkClicks) ? formatNumber(totalLinkClicks) : "-",
                                    name: "Total link clicks",
                                },
                                {
                                    icon: <i className="ri-eye-line ri-xl"></i>,
                                    value: !isEmpty(landingPageViews) ? formatNumber(landingPageViews) : "-",
                                    name: "Landing page views",
                                },
                                {
                                    icon: <i className="ri-eye-line ri-xl"></i>,
                                    value: !isEmpty(addToCarts) ? formatNumber(addToCarts) : "-",
                                    name: "Add to carts",
                                },
                                {
                                    icon: <i className="ri-eye-line ri-xl"></i>,
                                    value: !isEmpty(checkoutsInitiated) ? formatNumber(checkoutsInitiated) : "-",
                                    name: "Checkouts initiated",
                                },
                                {
                                    icon: <i className="ri-eye-line ri-xl"></i>,
                                    value: !isEmpty(totalOrders) ? formatNumber(totalOrders) : "-",
                                    name: "Total orders placed",
                                },
                            ]}
                        />
                    </TabPanel>
                </div>
            </div>
            <div>
                <div className="table-view-tab-switch-container">
                    <TabSwitch
                        handleTabChange={(ev, value) => {
                            setTableViewCurrTab(value);
                        }}
                        aria-label="icon position tabs example"
                        currentTab={tableViewCurrTab}
                        tabs={tableViewTabs}
                        height="55px"
                        width="fit-content"
                        variant={"underline"}
                    />
                </div>
                <TabPanel index={ALL_USERS} value={tableViewCurrTab} sx={{ margin: "0px", padding: "0px" }}>
                    <Grid
                        gridProps={{
                            columns: userColumns,
                            getRowHeight: () => 80,
                            pageSize: PAGE_SIZE,
                            loading: isUserGridLoading,
                            onPageChange: setPageNumber,
                            onRowClick: (params) => {
                                navigate(`/user-journey/${params.row.id}`);
                            },
                            page: pageNumber,
                            rowCount: totalUserRows,
                            rows: userRows,
                        }}
                    />
                </TabPanel>
                <TabPanel index={CREATORS} value={tableViewCurrTab} sx={{ margin: "0px", padding: "0px" }}>
                    <div className={"grid-container"} style={{ height: 430 }}>
                        <DataGrid
                            loading={isCreatorGridLoading}
                            columns={creatorColumns}
                            rows={creatorRows}
                            getRowHeight={() => 92}
                            pageSize={PAGE_SIZE}
                            page={0}
                            onPageChange={() => {
                            }}
                            rowCount={totalCreatorRows}
                            className={"mui-data-grid"}
                            components={{
                                Footer: (props) => <CustomFooter totalRows={totalCreatorRows} pageSize={PAGE_SIZE}
                                                                 handlePageChange={() => {
                                                                 }} pageNumber={0}/>,
                            }}
                            disableColumnMenu
                            disableSelectionOnClick
                            getRowId={(row) => row.id}
                            initialState={{
                                sorting: { sortModel },
                            }}
                            // pagination
                            sortingMode={"client"}
                            sortingOrder={allowedSorts}
                            onSortModelChange={setSortModel}
                            sx={{
                                "& .hideRightSeparator > .MuiDataGrid-columnSeparator": {
                                    display: "none",
                                },
                            }}
                            localeText={{
                                noRowsLabel: (
                                    <span className={"body-m"} style={{ color: Colors.neutralsSecondaryGrey }}>
                    {"No creators found"}
                  </span>
                                ),
                            }}
                        />
                    </div>
                </TabPanel>
            </div>
        </div>
    );
}
