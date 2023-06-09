import axios from "axios";
import React, { useEffect, useState } from "react";
import { Box, Button, Grid, TextField, Checkbox } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function Display() {
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
  const handleConfirm = () => {
    console.log(selectedRows);
  };

  const columns = [
    {
      field: "id",
      headerName: "Id",
      flex: 0.8,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.8,
    },
    {
      field: "brand_name",
      headerName: "Brand Name",
      flex: 0.8,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.8,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 0.8,
    },
    {
      field: "link",
      headerName: "Link",
      flex: 0.8,
    },
  ];

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={10} sm={8} md={6} lg={4}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Url:"
                name="url"
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
            </Box>
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
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="contained" color="primary" onClick={handleConfirm}>
              Xác nhận
            </Button>
          </Grid>
          <Box sx={{ height: "calc(100vh - 320px)", width: "100%" }}>
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
          </Box>
        </Grid>
      </Box>
    </>
  );
}

export default Display;