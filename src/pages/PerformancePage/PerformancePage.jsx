import React, { useEffect, useState } from "react";
import "./PerformancePage.scss";
import SummaryMetrics from "../../components/SummaryComponents/SummaryMetrics/SummaryMetrics";
import { FilterMenu, Icons, TabSwitch, TextBox } from "../../components";
import { ALL_USERS, CREATORS, iconMapping, SUMMARY, UTM_LINKS } from "../../utils/constants";
import TabPanel from "../../components/TabSwitch/TabPanel";
import {
    getAllOrdersFromShopify,
    getAttributionStatistics,
    getCountOfAbondonedCheckout,
    getCreatorsData,
    getPromocodeAnalytics,
    getUserById,
    getUsers,
} from "../../api/api";
import { convertTimeToLocale, currencyFormatter, formatNumber, isEmpty, percentFormatter } from "../../utils/util";
import UtmLinksMetrics from "../../components/UtmLinksComponents/UtmLinksMetrics/UtmLinksMetrics";
import Grid from "../../components/Grid/Grid";
import { CustomFooter, getSortedHeaderClass } from "../../utils/DataGridUtils";
import { DataGrid } from "@mui/x-data-grid";
import { Colors } from "../../styles/colors";
import { useNavigate } from "react-router-dom";

export default function PerformancePage(props) {
    const [analytics, setAnalytics] = useState(null);
    const [attributionStatistics, setAttributionStatistics] = useState(null);
    const [totalOrderCount, setTotalOrderCount] = useState(null);
    const [totalAbondonedCheckouts, setTotalAbondonedCheckouts] = useState(null);
    const navigate = useNavigate();
    const [totalCreatorRows, setTotalCreatorRows] = useState(0);
    const [creatorRows, setCreatorRows] = useState([]);

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
    const totalLinkClicks = !isEmpty(creatorRows) ? creatorRows.reduce((acc, creator) => acc + Number(creator?.utm_clicks), 0) : null;
    const landingPageViews = !isEmpty(attributionStatistics) ? attributionStatistics.number_of_sessions : null;
    const clickThroughRate = (!isEmpty(landingPageViews) &&
        !isEmpty(totalLinkClicks) &&
        totalLinkClicks !== 0) ? (landingPageViews / totalLinkClicks) : null;
    const costPerLpv = (!isEmpty(totalCreatorCost) &&
        !isEmpty(landingPageViews) &&
        landingPageViews !== 0) ? (totalCreatorCost / landingPageViews) : null;
    const addToCarts = (!isEmpty(totalOrderCount) && !isEmpty(totalAbondonedCheckouts)) ?
        totalOrderCount + totalAbondonedCheckouts : null;
    const checkoutsInitiated = totalOrderCount;

    const PAGE_SIZE = 10;
    const [isUserGridLoading, setUserGridLoading] = useState(false);
    const [isCreatorGridLoading, setCreatorGridLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalUserRows, setTotalUserRows] = useState(0);
    const [userRows, setUserRows] = useState([]);

    const defaultSortModel = [{ field: "roi", sort: "desc" }];
    const [sortModel, setSortModel] = useState(defaultSortModel);
    const [searchUserIdText, setSearchUserIdText] = useState(null);

    useEffect(() => {
        const storeId = process.env.REACT_APP_STORE_ID;
        getPromocodeAnalytics({ storeId }).then(setAnalytics);
        getAttributionStatistics().then(setAttributionStatistics);
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

    function fetchUsers() {
        setUserGridLoading(true);
        getUsers({
            limit: PAGE_SIZE,
            offset: pageNumber * PAGE_SIZE,
        })
            .then(setUserRows)
            .finally(() => {
                setUserGridLoading(false);
            });
    }

    function fetchTotalUsersCount() {
        if (!isEmpty(attributionStatistics)) {
            getUsers({
                list_only_anonymous_users: false,
            }).then(rows => {
                setTotalUserRows(attributionStatistics.number_of_users - rows.length);
            });
        }

    }

    useEffect(() => {
        if (isEmpty(searchUserIdText)) {
            fetchUsers();
            fetchTotalUsersCount();
        } else {
            setUserGridLoading(true);
            getUserById({
                userId: searchUserIdText
            }).then((res) => {
                if (isEmpty(res)) {
                    setUserRows([]);
                    setTotalUserRows(0);
                } else {
                    setUserRows([res]);
                    setTotalUserRows(1);
                }
            }).catch((error) => {
                console.error("Error fetching user data", error);
                fetchUsers();
                fetchTotalUsersCount();
            }).finally(() => setUserGridLoading(false));
        }
    }, [pageNumber, searchUserIdText]);

    useEffect(() => {
        fetchTotalUsersCount();
    }, [attributionStatistics]);

    const commonHeaderProps = {
        flex: 1,
        headerClassName: "subtitle-m mui-data-grid-header hideRightSeparator",
    };

    // Users table
    function renderIdCell(params) {
        let id = '-', icon = null;
        const icons = [
            <Icons.avatar1_demo/>,
            <Icons.avatar2_demo/>,
            <Icons.avatar3_demo/>,
            <Icons.avatar4_demo/>,
            <Icons.avatar5_demo/>,
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
            number_of_fingerprints = (params.row.number_of_fingerprints === 1) ?
                `${formatNumber(params.row.number_of_fingerprints)} device` :
                `${formatNumber(params.row.number_of_fingerprints)} devices`;
        }
        return <span className={'body-r'}>{number_of_fingerprints}</span>;
    }

    function renderNumberofSessionsCell(params) {
        let number_of_sessions = '-';
        if (!isEmpty(params.row.number_of_sessions) && params.row.number_of_sessions !== 0) {
            number_of_sessions = formatNumber(params.row.number_of_sessions);
        }
        return <span className={'body-r'}>{number_of_sessions}</span>;
    }

    function renderLastActiveCell(params) {
        let updated_at = '-';
        if (!isEmpty(params.row.updated_at)) {
            updated_at = convertTimeToLocale(params.row.updated_at);
        }
        return <span className={'body-r'}>{updated_at}</span>;
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
            flex: 0.3
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
            field: "number_of_sessions",
            headerAlign: "right",
            headerName: "# of sessions",
            renderCell: renderNumberofSessionsCell,
            sortable: false,
            flex: 0.3
        },
        {
            ...commonHeaderProps,
            align: "right",
            field: "updated_at",
            headerAlign: "right",
            headerName: "Last updated on",
            renderCell: renderLastActiveCell,
            // headerClassName: `${commonHeaderProps.headerClassName} ${getSortedHeaderClass(sortModel, 'updated_at')}`,
            sortable: false,
            flex: 0.5
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
            total_sales = currencyFormatter.format(params.row.total_sales);
        }
        return <span className={'body-r'}>{total_sales}</span>;
    }

    function renderRoiCell(params) {
        let roi = '-';
        if (!isEmpty(params.row.roi) && params.row.roi !== 0) {
            roi = percentFormatter.format(params.row.roi);
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
            flex: 0.8
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
            flex: 0.5
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
            flex: 0.7
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
            flex: 0.6
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
            flex: 0.5
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
            flex: 1
        },
    ];
    const allowedSorts = ["desc", "asc"];

    const postTypeMenu = {
        firstName: "Post types",
        selectedValueText: 'Linear',
        options: [
            {
                text: 'Linear',
                checked: true,
                isVisible: true,
                onClick: () => {
                },
            }
        ],
    };

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
                                    tooltip: 'Return on Investment for this campaign. ROI = ( Total sales / Total creator cost) * 100.',
                                },
                                subMetrics: [
                                    {
                                        icon: <i className="ri-money-dollar-circle-line"></i>,
                                        value: !isEmpty(totalSales) ? currencyFormatter.format(totalSales) : "-",
                                        name: "Total Sales",
                                        subtitle: `${!isEmpty(averageSalesPerUser) ? currencyFormatter.format(averageSalesPerUser) : "-"} average sales per user`,
                                        tooltip: 'Total value of products purchased by users who clicked your links'
                                    },
                                    {
                                        icon: <i className="ri-user-line"></i>,
                                        value: currencyFormatter.format(totalCreatorCost),
                                        name: "Total creator cost",
                                        subtitle: `${!isEmpty(averageCreatorCost) ? currencyFormatter.format(averageCreatorCost) : "-"} average creator cost`,
                                        tooltip: 'Total amount spent on the creators who are part of the campaign',
                                    },
                                ],
                            }}
                            rightMetrics={[
                                {
                                    icon: <i className="ri-chat-3-line"></i>,
                                    value: !isEmpty(totalEventsCaptured) ? formatNumber(totalEventsCaptured) : "-",
                                    name: "Total events captured",
                                    subtitle: `${!isEmpty(averageEventsPerUser) ? formatNumber(averageEventsPerUser) : "-"} average events per user`,
                                },
                                {
                                    icon: <i className="ri-archive-2-line"></i>,
                                    value: !isEmpty(totalOrders) ? formatNumber(totalOrders) : "-",
                                    name: "Total orders",
                                    subtitle: `${!isEmpty(averageOrdersPerUser) ? formatNumber(averageOrdersPerUser) : "-"} average orders per user`,
                                    tooltip: "Total number of orders made by users who clicked your links",
                                },
                                {
                                    icon: <i className="ri-user-line"></i>,
                                    value: !isEmpty(totalUsers) ? totalUsers : "-",
                                    name: "Total users",
                                    tooltip: 'Total number of users who interacted with UTM links',
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
                                    tooltip: 'Ratio of checkout initiations to link clicks expressed as a percentage'
                                },
                                subMetrics: [
                                    {
                                        icon: <i className="ri-money-dollar-circle-line"></i>,
                                        value: !isEmpty(costPerLpv) ? currencyFormatter.format(costPerLpv) : "-",
                                        name: "Cost per LPV",
                                        subtitle: `${!isEmpty(averageSalesPerUser) ? currencyFormatter.format(averageSalesPerUser) : "-"} average sales per user`,
                                        tooltip: 'Cost spent for each successful landing page visit',
                                    },
                                ],
                            }}
                            rightMetrics={[
                                {
                                    icon: <i className="ri-links-line"></i>,
                                    value: !isEmpty(totalLinkClicks) ? formatNumber(totalLinkClicks) : "-",
                                    name: "Total link clicks",
                                    tooltip: 'Total number of times UTM links were clicked',
                                },
                                {
                                    icon: <i className="ri-eye-line"></i>,
                                    value: !isEmpty(landingPageViews) ? formatNumber(landingPageViews) : "-",
                                    name: "Landing page views",
                                    tooltip: 'Total number of users who viewed your site through the UTM link',
                                },
                                {
                                    icon: <i className="ri-shopping-cart-2-line"></i>,
                                    value: !isEmpty(addToCarts) ? formatNumber(addToCarts) : "-",
                                    name: "Add to carts",
                                    tooltip: 'Total number of users who visited your site through the UTM link and added at least one item to cart',
                                },
                                {
                                    icon: <i className="ri-shopping-bag-3-line"></i>,
                                    value: !isEmpty(checkoutsInitiated) ? formatNumber(checkoutsInitiated) : "-",
                                    name: "Checkouts initiated",
                                    tooltip: 'Total number of users who visited your site through the UTM link and initiated checkout',
                                },
                                {
                                    icon: <i className="ri-archive-2-line"></i>,
                                    value: !isEmpty(totalOrders) ? formatNumber(totalOrders) : "-",
                                    name: "Total orders placed",
                                    tooltip: 'Total number of orders made by users who clicked your links',
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
                    <div className={'div-all-users-search-container'}>
                        <TextBox
                            disabled={isUserGridLoading}
                            variant={'default-with-search-icon'}
                            placeholder={'Search user ID'}
                            onEnter={setSearchUserIdText}
                            value={searchUserIdText}
                            onClear={() => setSearchUserIdText("")}/>

                    </div>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, }}>
                        <div style={{ display: 'flex', gap: 32 }}>
                            <TextBox variant={'default-with-search-icon'}
                                     placeholder={'Search creator '}
                                     onEnter={() => {
                                     }}
                                     value={''}
                                     onClear={() => {
                                     }}/>
                            <FilterMenu
                                menuItems={postTypeMenu.options}
                                firstItem={'Attribution model'}
                                rowRenderer={(index) => {
                                    return postTypeMenu.options[index].text;
                                }}
                                selectedValueText={'Linear'}

                            />
                        </div>
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
                    </div>
                </TabPanel>
            </div>
        </div>
    );
}
