import React, { useEffect, useState } from "react";
import "./PerformancePage.scss";
import SummaryMetrics from "../../components/SummaryComponents/SummaryMetrics/SummaryMetrics";
import { TabSwitch } from "../../components";
import { ALL_USERS, CREATORS, SUMMARY, UTM_LINKS } from "../../utils/constants";
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
  const totalSales = order_summary ? order_summary.total_orders_amount_fulfilled : null;
  const totalCreatorCost = TOTAL_CREATOR_COST;
  const averageCreatorCost = totalCreatorCost / NUMBER_OF_CREATORS;
  const totalRoi = totalCreatorCost !== 0 ? totalSales / totalCreatorCost : null;
  const totalEventsCaptured = attributionStatistics ? attributionStatistics.number_of_events : null;
  const totalOrders = !isEmpty(order_summary) ? order_summary.total_orders : null;
  const totalUsers = !isEmpty(attributionStatistics) ? attributionStatistics.number_of_users : null;
  const averageEventsPerUser = !isEmpty(totalUsers) && totalUsers !== 0 ? totalEventsCaptured / totalUsers : null;
  const averageOrdersPerUser = !isEmpty(totalUsers) && totalUsers !== 0 ? totalOrders / totalUsers : null;
  const averageSalesPerUser = !isEmpty(totalUsers) && totalUsers !== 0 ? totalSales / totalUsers : null;

  // Calculations - UTM Links
  const totalLinkClicks = !isEmpty(dashboardLinkMetrics) ? dashboardLinkMetrics.total_clicks : null;
  const landingPageViews = attributionStatistics ? attributionStatistics.number_of_sessions : null;
  const clickThroughRate = !isEmpty(landingPageViews) && landingPageViews !== 0 ? totalLinkClicks / landingPageViews : null;
  const costPerLpv = !isEmpty(totalCreatorCost) && totalCreatorCost !== 0 && landingPageViews !== 0 ? totalCreatorCost / landingPageViews : null;
  const addToCarts = (totalOrderCount || 0) + (totalAbondonedCheckouts || 0);
  const checkoutsInitiated = totalOrderCount || 0;

  const ROW_HEIGHT = 100;
  const PAGE_SIZE = 10;
  const [isGridLoading, setGridLoading] = useState(false);
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
    getCreatorsData().then((res) => {
      if (!isEmpty(res)) {
        setCreatorRows(res);
        setTotalCreatorRows(res?.length);
      }
    });
    getAllOrdersFromShopify().then((res) => {
      setTotalOrderCount(res?.count);
    });
    getCountOfAbondonedCheckout().then((res) => {
      setTotalAbondonedCheckouts(res?.checkouts?.length);
    });
  }, []);

  useEffect(() => {
    setGridLoading(true);
    getUsers({
      limit: PAGE_SIZE,
      offset: pageNumber * PAGE_SIZE,
    })
      .then(setUserRows)
      .finally(() => {
        setGridLoading(false);
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
    const id = params.row["id"];
    return id;
  }

  function renderEventsCell(params) {
    const number_of_events = params.row["number_of_events"];
    return number_of_events;
  }

  function renderDeviceCountCell(params) {
    const number_of_fingerprints = params.row["number_of_fingerprints"];
    return number_of_fingerprints;
  }

  function renderLastActiveCell(params) {
    let date = params.row["event_timestamp"];
    if (date === undefined) {
      date = params.row["updated_at"];
    }
    return convertTimeToLocale(date);
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
    },
    {
      ...commonHeaderProps,
      align: "right",
      field: "number_of_fingerprints",
      headerAlign: "right",
      headerName: "Device count",
      renderCell: renderDeviceCountCell,
      sortable: false,
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
    },
  ];

  // Creators table

  function renderNameCell(params) {
    const name = params.row["name"];
    return name;
  }

  function renderUtmClicksCell(params) {
    const utm_clicks = params.row["utm_clicks"];
    return params.row.utm_clicks;
  }

  function renderCreatorCostCell(params) {
    const creator_cost = params.row["creator_cost"];
    return creator_cost;
  }

  function renderTotalSalesCell(params) {
    const total_sales = params.row["total_sales"];
    return total_sales;
  }

  function renderRoiCell(params) {
    const roi = params.row["roi"];
    return roi;
  }

  function renderPlatformsCell(params) {
    const platforms = params.row["platforms"].join();
    return platforms;
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
      flex: 1,
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
              loading: isGridLoading,
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
              columns={creatorColumns}
              rows={creatorRows}
              getRowHeight={() => 92}
              pageSize={PAGE_SIZE}
              page={0}
              onPageChange={() => {}}
              rowCount={totalCreatorRows}
              className={"mui-data-grid"}
              components={{
                Footer: (props) => <CustomFooter totalRows={totalCreatorRows} pageSize={PAGE_SIZE} handlePageChange={() => {}} pageNumber={0} />,
              }}
              disableColumnMenu
              disableSelectionOnClick
              getRowId={(row) => row.id}
              initialState={{
                sorting: { sortModel },
              }}
              pagination
              paginationMode={"server"}
              sortingMode={"client"}
              sortingOrder={allowedSorts}
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
