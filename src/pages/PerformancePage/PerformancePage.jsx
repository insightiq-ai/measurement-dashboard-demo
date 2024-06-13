import React, { useEffect, useState } from "react";
import "./PerformancePage.scss";
import SummaryMetrics from "../../components/SummaryComponents/SummaryMetrics/SummaryMetrics";
import { TabSwitch } from "../../components";
import { ALL_USERS, CREATORS, SUMMARY, UTM_LINKS, TOTAL_CREATOR_COST, NUMBER_OF_CREATORS } from "../../utils/constants";
import TabPanel from "../../components/TabSwitch/TabPanel";
import {
  getAllOrdersFromShopify,
  getAttributionStatistics,
  getCountOfAbondonedCheckout,
  getDashboardLinkMetrics,
  getPromocodeAnalytics,
  getTotalOrderPerAUID,
  getUsers,
} from "../../api/api";
import { currencyFormatter, formatNumber, isEmpty, percentFormatter } from "../../utils/util";
import UtmLinksMetrics from "../../components/UtmLinksComponents/UtmLinksMetrics/UtmLinksMetrics";
import { CustomFooter, getSortedHeaderClass } from "../../utils/DataGridUtils";
import { DataGrid } from "@mui/x-data-grid";
import { Colors } from "../../styles/colors";
import Grid from "../../components/Grid/Grid";
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
  const checkoutsInitiated = totalAbondonedCheckouts || 0;

  const defaultSortModel = [{ field: "updated_at", sort: "desc" }];
  const [sortModel, setSortModel] = useState(defaultSortModel);
  const ROW_HEIGHT = 100;
  const PAGE_SIZE = 10;
  const [isGridLoading, setGridLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalUserRows, setTotalUserRows] = useState(0);
  const [userRows, setUserRows] = useState([]);

  useEffect(() => {
    const storeId = "0cce0866-c57d-483c-a0fa-49ed138d6f5f";
    // const storeId = '671ade3e-133b-4bcb-932e-a81321e9cc83';
    // const storeId = '554ad27b-7eba-4980-a3ff-f4c4e7e38d26';
    getPromocodeAnalytics({ storeId }).then((res) => {
      console.log(`getPromocodeAnalytics`);
      console.log(res);
      setAnalytics(res);
    });
  }, []);

  useEffect(() => {
    getAttributionStatistics().then((res) => {
      console.log(`getAttributionStatistics`);
      console.log(res);
      setAttributionStatistics(res);
    });
  }, []);

  useEffect(() => {
    getDashboardLinkMetrics().then((res) => {
      console.log(`getDashboardLinkMetrics`);
      console.log(res);
      setDashboardLinkMetrics(res);
    });

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

  useEffect(() => {
    setGridLoading(true);
    getUsers({
      limit: PAGE_SIZE,
      offset: pageNumber * PAGE_SIZE,
    })
      .then((res) => {
        console.log(`getUsers`);
        console.log(res);
        // const { data } = res;
        setUserRows(res);
      })
      .finally(() => {
        setGridLoading(false);
      });
  }, [sortModel, pageNumber]);

  useEffect(() => {
    if (!isEmpty(attributionStatistics)) {
      setTotalUserRows(attributionStatistics.number_of_users);
    }
  }, [attributionStatistics]);

  useEffect(() => {
    getAllOrdersFromShopify().then((res) => {
      setTotalOrderCount(res.count);
    });
    getCountOfAbondonedCheckout().then((res) => {
      setTotalAbondonedCheckouts(res.checkouts.length);
    });
  }, []);

  const commonHeaderProps = {
    flex: 1,
    headerClassName: "subtitle-m mui-data-grid-header hideRightSeparator",
  };

  function renderIdCell(params) {
    const id = params.row["id"];
    return <p>{id}</p>;
  }

  function renderEventsCell(params) {
    const number_of_events = params.row["number_of_events"];
    return <p>{number_of_events}</p>;
  }

  function renderTotalSalesCell(params) {
    // const id = params.row['id'];
    return <p>{100}</p>;
  }

  function renderDeviceCountCell(params) {
    const number_of_fingerprints = params.row["number_of_fingerprints"];
    return <p>{number_of_fingerprints}</p>;
  }

  function renderLastActiveCell(params) {
    let date = params.row["event_timestamp"];
    if (date === undefined) {
      date = params.row["updated_at"];
    }
    return <p>{date}</p>;
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
      align: "left",
      field: "number_of_events",
      headerAlign: "left",
      headerName: "Events collected",
      renderCell: renderEventsCell,
      sortable: false,
    },
    // {
    //     ...commonHeaderProps,
    //     align: 'left',
    //     field: 'something',
    //     headerAlign: 'left',
    //     headerName: 'Total sales',
    //     renderCell: renderTotalSalesCell,
    //     sortable: false,
    // },
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
      align: "left",
      field: "updated_at",
      headerAlign: "left",
      headerName: "Last active on",
      renderCell: renderLastActiveCell,
      headerClassName: `${commonHeaderProps.headerClassName} ${getSortedHeaderClass(sortModel, "updated_at")}`,
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
              getRowHeight: () => ROW_HEIGHT,
              pageSize: PAGE_SIZE,
              loading: isGridLoading,
              onPageChange: setPageNumber,
              onRowClick: (params) => {
                navigate(`/user-journey/${params.row.id}`);
              },
              onSortModelChange: setSortModel,
              page: pageNumber,
              rowCount: totalUserRows,
              rows: userRows,
              sortModel,
            }}
          />
        </TabPanel>
        <TabPanel index={CREATORS} value={tableViewCurrTab} sx={{ margin: "0px", padding: "0px" }}>
          <Grid
            gridProps={{
              columns: userColumns,
              getRowHeight: () => ROW_HEIGHT,
              pageSize: PAGE_SIZE,
              loading: isGridLoading,
              onPageChange: setPageNumber,
              onRowClick: (params) => {
                navigate(`/user-journey/${params.row.id}`);
              },
              onSortModelChange: setSortModel,
              page: pageNumber,
              rowCount: totalUserRows,
              rows: userRows,
              sortModel,
            }}
          />
        </TabPanel>
      </div>
    </div>
  );
}
