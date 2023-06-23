import axios from "axios";
import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  useTheme,
  Modal,
  Typography,
  CircularProgress,
  Link,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../api/api.jsx";

function Search() {
  const authToken = JSON.parse(JSON.stringify(localStorage.getItem("token")));
  const theme = useTheme();
  const [form, setForm] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    if (form.search) {
      try {
        const response = await axios.get(
          API_BASE_URL + "/watsons/" + form.search,{
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setData(response.data);
        console.log(data);
        console.log("Yêu cầu đã được gửi thành công!");
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu:", error);
        console.error("Lỗi khi gửi yêu cầu:", error);
        toast.error("Xuất hiện lỗi trong quá trình lấy dữ liệu " + error, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    } else {
      toast.error("Bạn vui lòng nhập từ khóa vào ô search!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: true,
      });
    }

    setLoading(false);
  };

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      console.log(selectedRows);
      // Send request to the server
      const response = await axios.post(
        API_BASE_URL + "/watsons",
        {
          s_links: selectedRows,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      console.log(response.data);
      // Handle the response
      if (response.data.message === "successful") {
        toast.success(
          "Bạn đã lưu tổng cộng " +
            response.data.size +
            " link trong cơ sở dữ liệu!",
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            hideProgressBar: true,
          }
        );
      } else {
        toast.error("Bạn đã lưu 1000 link, không thể lưu thêm!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
      setOpen(false);
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      toast.error("Có lỗi xảy ra khi lưu link!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: true,
      });
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
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.2,
    },
    {
      field: "original_price",
      headerName: "Original price",
      flex: 0.2,
    },
    {
      field: "link",
      headerName: "Link",
      flex: 1,
      renderCell: (params) => {
        const linkUrl = params.value;
        return (
          <Link
            href={linkUrl}
            target="_blank"
            rel="noopener"
            sx={{ color: "white", textDecoration: "none" }}
          >
            {linkUrl}
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <ToastContainer />
        <Header title="WATSON" subtitle="Search of Watson" />
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
              <Button variant="contained" color="primary" onClick={handleModal}>
                Submit
              </Button>
            </Box>
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
              const selectedData = selectedRows.map((row) => ({
                link: row.link,
                id_watson: parseInt(row.idWatson),
              }));
              console.log(selectedData)
              setSelectedRows(selectedData);
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
                Confirm Save to Favorites
              </Typography>
              <Typography variant="body1" component="p" sx={{ mb: 4 }}>
                Are you sure you want to save the selected products to your
                favorites?
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
