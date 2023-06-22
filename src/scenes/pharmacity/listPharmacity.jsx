import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../App.css";
import {
  Box,
  Button,
  Grid,
  TextField,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../api/api.jsx";

function Search() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    if (!form.search) {
      toast.error("Bạn vui lòng nhập từ khóa vào ô search!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: true,
      });
    } else {
      setLoading(true);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setLoading(true);
    }
  };

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [paginationModel.page, paginationModel.pageSize, loading]);

  // thêm một useEffect mới, được kích hoạt khi errorOccurred thay đổi. Nếu errorOccurred là true,
  // tức là đã xảy ra lỗi, chúng ta hiển thị thông báo lỗi một lần duy nhất
  useEffect(() => {
    if (errorOccurred) {
      toast.error("Có lỗi xảy ra khi lấy dữ liệu từ database " + error, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: true,
      });
      setError("");
    }
  }, [errorOccurred]);

  const fetchData = async () => {
    try {
      const skip = paginationModel.page * paginationModel.pageSize;
      const limit = paginationModel.pageSize;
      const search = form.search;
      const response = await axios.get(API_BASE_URL + "/pharmacity", {
        params: {
          skip,
          limit,
          name: `${search}`,
        },
      });
      setData(response.data.listPharmacity);
      setTotalRows(response.data.count);
      console.log(response.data);
      console.log("Yêu cầu đã được gửi thành công!");
      setLoading(false);
      setErrorOccurred(false); // Đặt biến trạng thái lỗi về false khi thành công
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      setErrorOccurred(true); // Đặt biến trạng thái lỗi thành true
      setError(error);
    }
    setLoading(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "#",
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
      field: "brick_price",
      headerName: "Brick Price",
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
        <ToastContainer />
        <Header title="PHARMACITY" subtitle="List Pharmacity" />
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
              color: "white",
            },
          }}
        >
          <Grid item xs={10} sm={8} md={6} lg={4}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Search:"
                name="search"
                onChange={handleChange}
                variant="outlined"
                size="small"
                onKeyDown={handleKeyDown}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mr: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Search"}
              </Button>
            </Box>
          </Grid>
          <DataGrid
            rows={data ? data : []}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 30]}
            rowCount={totalRows}
            paginationMode="server"
          />
        </Box>
      </Box>
    </>
  );
}

export default Search;