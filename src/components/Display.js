import axios from "axios";
import React, { useEffect, useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function Display() {
  const [form, setForm] = useState({});
  const [data, setData] = useState([]);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://127.0.0.1:8000/' + form.search);
      setData(response.data);
      console.log(data)
      console.log('Yêu cầu đã được gửi thành công!');
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
    }
  };
  
  const columns = [
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
    }
  ]

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
          </Grid>
        </Grid>
      </Box>
      <DataGrid
          loading={true}
          getRowId={(row) => row.name}
          rows={data}
          columns={columns}
        />
    </>
  );
}

export default Display;
