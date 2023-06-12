import React from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import BreakdownChart from "components/BreakdownChart";
import OverviewChart from "components/OverviewChart";
import StatBox from "components/StatBox";
const fakeData = {
  totalCustomers: 1234,
  todayStats: {
    totalSales: 256.78,
    totalOrders: 15,
    totalNewCustomers: 3,
  },
  thisMonthStats: {
    totalSales: 6789.01,
    totalOrders: 467,
    totalNewCustomers: 85,
  },
  yearlySalesTotal: 123456.78,
  transactions: [
    {
      _id: "1",
      userId: "Mai",
      createdAt: "2022-03-13T14:10:17.833Z",
      products: ["product-1", "product-2", "product-3"],
      cost: 100.0,
    },
    {
      _id: "2",
      userId: "Hiếu",
      createdAt: "2022-03-13T12:22:45.100Z",
      products: ["product-2", "product-3"],
      cost: 75.5,
    },
    {
      _id: "3",
      userId: "Sơn",
      createdAt: "2022-03-12T18:39:10.512Z",
      products: ["product-1"],
      cost: 50.0,
    },
    {
      _id: "4",
      userId: "Phú",
      createdAt: "2022-03-12T08:15:01.001Z",
      products: ["product-3", "product-4"],
      cost: 125.99,
    },
  ],
};

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Total Customers"
          value={fakeData && fakeData.totalCustomers}
          increase="+14%"
          description="Since last month"
          icon={
            <Email
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Sales Today"
          value={fakeData && fakeData.todayStats.totalSales}
          increase="+21%"
          description="Since last month"
          icon={
            <PointOfSale
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart view="sales" isDashboard={true} />
        </Box>
        <StatBox
          title="Monthly Sales"
          value={fakeData && fakeData.thisMonthStats.totalSales}
          increase="+5%"
          description="Since last month"
          icon={
            <PersonAdd
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Yearly Sales"
          value={fakeData && fakeData.yearlySalesTotal}
          increase="+43%"
          description="Since last month"
          icon={
            <Traffic
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuifakeDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuifakeDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuifakeDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuifakeDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuifakeDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuifakeDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            loading={!fakeData}
            getRowId={(row) => row._id}
            rows={(fakeData && fakeData.transactions) || []}
            columns={columns}
          />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Sales By Category
          </Typography>
          <BreakdownChart isDashboard={true} />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Breakdown of real states and information via category for revenue
            made for this year and total sales.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;