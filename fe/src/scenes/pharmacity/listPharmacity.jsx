import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Checkbox,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";

function Search() {

  const theme = useTheme();
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/products");
      setData(response.data);
      console.log(response.data);
      console.log("Yêu cầu đã được gửi thành công!");
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Id",
      flex: 0.1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.8,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.3,
    },
    {
      field: "total",
      headerName: "Total",
      flex: 0.3,
    },
  ];

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <Header title="HASAKI" subtitle="List Product" />
        <Box
          mt="40px"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.primary.light,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
            "& .image": {
              borderRadius: "50%",
            },
            "& .MuiDataGrid-checkboxInput.Mui-checked": {
              // CSS styles for checked checkbox input
              // For example:
              color: "white",
            },
          }}
        >
          <Box sx={{ height: "calc(100vh - 320px)", maxWidth: "170vh" }}>
            <DataGrid
            
              getRowId={(row) => row.id}
              columns={columns}
              rows={data}
              initialState={{
                ...data.initialState,
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10, 20, 30]}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Search;
