import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  useTheme,
  Modal,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "scenes/api/api";
import { useNavigate  } from "react-router-dom";

function Search() {
  const authToken = JSON.parse(JSON.stringify(localStorage.getItem("token")));
  const theme = useTheme();
  const navigate = useNavigate()
  const [form, setForm] = useState({});
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const status = true;
      const hour = parseInt(form.hour);
      const minute = 0;
      console.log(hour);
      const response = await axios.post(
        API_BASE_URL + "/cron-job",
        {
          status,
          hour,
          minute,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Yêu cầu đã được gửi thành công!");
      if (response.data === "success") {
        toast.success("Tự động Crawl đã được bật", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    }
    setLoading(false);
  };
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      const status = false;
      const hour = 0;
      const minute = 0;
      const response = await axios.post(API_BASE_URL + "/cron-job", {
        status,
        hour,
        minute,
        
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response.data);
      if (response.data === "deleted") {
        toast.success("Tự động Crawl đã được tắt", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
      setOpen(false);
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    }
  };
  const handleModal = async () => {
    setOpen(true);
  };

  const handleCancel = async () => {
    setOpen(false);
  };
  const columns = [
    {
      field: "id",
      headerName: "Id",
      flex: 0.1,
    },
    {
      field: "proxy",
      headerName: "Proxy",
      flex: 0.8,
    },
    {
      field: "username",
      headerName: "User Name",
      flex: 0.3,
    },
    {
      field: "password",
      headerName: "Password",
      flex: 0.3,
    },
    {
      field: "country",
      headerName: "Country",
      flex: 0.3,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
  ];

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <ToastContainer />
        <Header title="Crawl Control" subtitle="Edit cron job crawl" />
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
          <Grid item xs={10} sm={8} md={6} lg={4}>
            <Box sx={{ mb: 1 }}>
              <TextField
                style={{ width: "100px" }}
                label="Hour"
                name="hour"
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Button variant="contained" color="primary" onClick={handleModal}>
                OFF
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ ml: 2 }}
                disabled={loading} // Disable nút Search khi đang loading
              >
                {loading ? (
                  <CircularProgress size={24} /> // Hiển thị CircularProgress khi đang loading
                ) : (
                  "SUBMIT"
                )}
              </Button>
            </Box>
            <h2 variant="contained" color="primary">
              Proxy List
            </h2>
          </Grid>
          <DataGrid
            getRowId={(row) => row.id}
            columns={columns}
            rows={data}
            checkboxSelection
            disableRowSelectionOnClick
            initialState={{
              ...data.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 20, 30]}
            onRowSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const selectedRows = data.filter((row) =>
                selectedIDs.has(row.id)
              );
              const selectedLinks = selectedRows.map((row) => row.link);
              setSelectedRows(selectedLinks);
            }}
          />
          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: theme.palette.primary[700],
                borderRadius: 8,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                Xác nhận để huỷ bỏ
              </Typography>
              <Typography variant="body1" component="p" sx={{ mb: 4 }}>
                Bạn có chắc chắn muốn tắt tự động lấy dữ liệu ?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancel}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirm}
                >
                  Confirm
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
      </Box>
    </>
  );
}

export default Search;
