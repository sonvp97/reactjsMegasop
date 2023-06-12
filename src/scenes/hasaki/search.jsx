import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Checkbox,
  useTheme,
  Modal,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";

function Search() {
  const theme = useTheme();
  const [form, setForm] = useState({});
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://127.0.0.1:8000/" + form.search);
      setData(response.data);
      console.log(data);
      console.log("Yêu cầu đã được gửi thành công!");
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    }
  };
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      // Gửi yêu cầu đến server
      const response = await axios.post("http://127.0.0.1:8000/s_link", {
        s_links: selectedRows,
      });
      console.log(response.data);

      setSuccessMessage("Yêu cầu đã được gửi thành công!");
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
      field: "name",
      headerName: "Name",
      flex: 0.8,
    },
    {
      field: "brand_name",
      headerName: "Brand Name",
      flex: 0.3,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.3,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 0.3,
    },
    {
      field: "link",
      headerName: "Link",
      flex: 1,
    },
  ];

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <Header title="HASAKI" subtitle="Search of Product" />
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
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Search:"
                name="search"
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mr: 2 }}
              >
                Search
              </Button>
              <Button variant="contained" color="primary" onClick={handleModal}>
                Submit
              </Button>
            </Box>
          </Grid>
          <Box sx={{ height: "calc(100vh - 420px)" }}>
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
      </Box>
    </>
  );
}

export default Search;
