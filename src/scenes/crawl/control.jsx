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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Link
} from "@mui/material";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "scenes/api/api";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from '@mui/icons-material/Close';

function Search() {
  const authToken = JSON.parse(JSON.stringify(localStorage.getItem("token")));
  const [data, setData] = useState([]);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });
  const [dataReport, setDataReport] = useState([]);
  const [paginationModelReport, setPaginationModelReport] = React.useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [totalRowReport, setTotalRowReport] = useState(0);
  const [idDetail, setIdDetail] = useState("");


  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [isTime, setIsTime] = useState(false);
  const [report, setReport] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [number, setNumber] = useState(8);
  const [time, setTime] = useState("");

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [status, setStatus] = useState("");

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleTime1Change = (newValue) => {
    setFromDate(newValue.$d);
  };
  
  const handleSearchReportDetail = () => {
     handleBrandClick(idDetail) 
  };
  const handleTime2Change = (newValue) => {
    setToDate(newValue.$d);
  };
  useEffect(() => {
    getStatus();
  }, [isTime]);
  useEffect(() => {
    getListReport();
  }, [paginationModel.page, paginationModel.pageSize, report]);
  useEffect(() => {
    if(openReport){
      handleBrandClick(idDetail);
    }
  }, [paginationModelReport.page, paginationModelReport.pageSize]);
  const getStatus = async () => {
    try {
      const response = await axios.get(API_BASE_URL + "/job-exist", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response.data.status);
      if (response.data.status === "on") {
        setLoading(true);
        setNumber(response.data.schedule);
        setTime(response.data.time_next);
      } else {
        setTime("");
        setLoading(false);
        setNumber(8);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    }
  };
  const getListReport = async () => {
    try {
      const skip = paginationModel.page * paginationModel.pageSize;
      const limit = paginationModel.pageSize;
      const from_date = fromDate;
      const to_date = toDate;
      const response = await axios.get(API_BASE_URL + "/report", {
        params: {
          from_date,
          to_date,
          skip,
          limit,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response.data);
      setData(response.data.listReport);
      setTotalRows(response.data.count);
    } catch (error) {}
  };
  const handleSearchReport = (e) => {
    setReport(!report);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setNumber("");
    } else if (/^\d+$/.test(value) && parseInt(value) > 0) {
      setNumber(value);
    }
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const status = true;
      const hour = parseInt(number);
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
      setIsTime(!isTime);
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
    setOpenModal(false);
  };

  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleModal = async () => {
    setOpen(true);
  };

  const handleModalSubmit = async () => {
    setOpenModal(true);
  };

  const handleCloseReport = async () => {
    setOpenReport(false);
    setStatus("")
  };
  const handleCancelModal = async () => {
    setOpenModal(false);
  };

  const handleCancel = async () => {
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleBrandClick = async (id) => {
    setOpenReport(true);
    setIdDetail(id)
    const clickedObject = data.find((item) => item.id === id);
    try {
      const skip = paginationModelReport.page * paginationModelReport.pageSize;
      const limit = paginationModelReport.pageSize;
      const report_id = clickedObject.report_id;
    const brand_id = clickedObject.brand_id;
      const response = await axios.get(API_BASE_URL + "/report/detail", {
        params: {
          skip,
          limit,
          report_id,
          status,
          brand_id,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response.data.listReportDetail);
      setDataReport(response.data.listReportDetail);
      setTotalRowReport(response.data.count);
    } catch (error) {}
  };

  const handleConfirm = async () => {
    try {
      const status = false;
      const hour = 0;
      const minute = 0;
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
      setIsTime(!isTime);
      console.log(response.data);
      if (response.data === "deleted") {
        toast.success("Tự động Crawl đã được tắt", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
      setOpen(false);
    } catch (error) {}
    setLoading(false);
  };
  const brandNames = {
    1: "Hasaki",
    2: "Pharmacity",
    3: "Guardian",
    4: "Watson",
  };
  const statusNames = {
    0: "FAILURE",
    1: "SUCCESS",
  };
  const columnReportDetail = [
    {
      field: "id",
      headerName: "#",
      flex: 0.1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.8,
      renderCell: (params) => (
        <Link
        href={params.value}
        target="_blank"
        rel="noopener"
        sx={{ color: "white", textDecoration: "none" }}
         style={{ whiteSpace: "pre-wrap" }}>{params.value}</Link>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.2,
      valueGetter: (params) => statusNames[params.value] || "",
    },
    {
      field: "time",
      headerName: "Crawl Time",
      flex: 0.3,
    },
  ];
  const columns = [
    {
      field: "id",
      headerName: "#",
      flex: 0.1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "brand_id",
      headerName: "Name Brand",
      flex: 0.2,
      renderCell: (params) => {
        const brandName = brandNames[params.value] || "";
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleBrandClick(params.id)}
          >
            {brandName}
          </div>
        );
      },
    },
    {
      field: "success",
      headerName: "Success",
      flex: 0.2,
    },
    {
      field: "failure",
      headerName: "Failure",
      flex: 0.2,
    },
    {
      field: "start_crawl",
      headerName: "Start Crawl",
      flex: 0.2,
    },
    {
      field: "end_crawl",
      headerName: "End Crawl",
      flex: 0.2,
    },
  ];

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <ToastContainer />
        <Header title="Crawl Setting" />
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
            "& .css-1u3bzj6-MuiFormControl-root-MuiTextField-root": {
              marginRight: "10px",
            },
            "& .css-v3zyv7-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
              {
                width: "80px",
              },
            "& .css-3cyd2n": {
              width: "100%",
            },
            "& .css-kg2jkk-MuiDataGrid-root": {
              maxWidth: "1189.2px",
              maxHeight: "559.2px",
            },
            "& .css-1vgpi90-MuiFormControl-root": {
              minWidth: "150px"
            },
          }}
        >
          <Grid item xs={10} sm={8} md={6} lg={4}>
            <Box sx={{ mb: 3 }}>
              <TextField
                style={{ width: "160px" }}
                label="Hour"
                name="hour"
                value={number}
                onChange={handleChange}
                variant="outlined"
                size="small"
                disabled={true}
              />
            </Box>
            <h4>Next time : {time}</h4>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleModal}
                disabled={!loading}
              >
                OFF
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleModalSubmit}
                sx={{ ml: 2 }}
                disabled={loading}
              >
                ON
              </Button>
            </Box>
          </Grid>
          <Box sx={{ mr: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={handleTime1Change}
                renderInput={(params) => <TextField {...params} />}
                format="yyyy-MM-dd HH:mm"
              />
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={handleTime2Change}
                renderInput={(params) => <TextField {...params} />}
                format="yyyy-MM-dd HH:mm"
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ mt: 1, mb: 1}}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchReport}
            >
              Search
            </Button>
          </Box>
          <DataGrid
            rows={data ? data : []}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 30]}
            rowCount={totalRows}
            paginationMode="server"
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
          <Modal open={openModal} onClose={handleClose}>
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
                Xác nhận để bật tự động lấy dữ liệu
              </Typography>
              <Typography variant="body1" component="p" sx={{ mb: 4 }}>
                Bạn có chắc muốn tự động lấy dữ liệu?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancelModal}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Confirm
                </Button>
              </Box>
            </Box>
          </Modal>
          <Modal open={openReport} onClose={handleCloseReport}>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100%",
                maxWidth: "1000px",
                bgcolor: theme.palette.primary[700],
                borderRadius: "8px 0 0 0",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                p: 4,
              }}
            >
              <IconButton
      sx={{ position: "absolute", top: 0, right: 0 }}
      onClick={handleCloseReport}
    >
      <CloseIcon />
    </IconButton>
              <FormControl sx={{ mb: 2,minWidth:"150px" }}>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  label="Status"
                  value={status}
                  onChange={handleStatusChange}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="0">FAILURE</MenuItem>
                  <MenuItem value="1">SUCCESS</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearchReportDetail}
                >
                  Search
                </Button>
              </Box>
              <DataGrid
                rows={dataReport ? dataReport : []}
                columns={columnReportDetail}
                paginationModel={paginationModelReport}
                onPaginationModelChange={setPaginationModelReport}
                pageSizeOptions={[10, 20, 30]}
                rowCount={totalRowReport}
                paginationMode="server"
                sx={{
                  maxHeight: "500px",
                  maxWidth: "1000px"
                }}
              />
            </Box>
          </Modal>
        </Box>
      </Box>
    </>
  );
}

export default Search;
