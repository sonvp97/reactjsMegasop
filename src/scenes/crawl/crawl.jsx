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
import { useNavigate } from "react-router-dom";

function Search() {
  const authToken = JSON.parse(JSON.stringify(localStorage.getItem("token")));
  const theme = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);


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

  const handleCancelModal = async () => {
    setOpenModal(false);
  };

  const handleCancel = async () => {
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
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
    setLoading(false)
  };
  const [isCrawlControlEnabled, setIsCrawlControlEnabled] = useState(false);
  const handleCrawlControlClick = () => {
    setIsCrawlControlEnabled(!isCrawlControlEnabled);
  };

  return (
    <>
      <Box
  display="flex"
  alignItems="center"
  justifyContent="center"
  m="1.5rem 2.5rem"
>
  <Button variant="contained" color="primary" onClick={handleCrawlControlClick}>
    Crawl Data
  </Button>
  {isCrawlControlEnabled && (
    <Box sx={{ ml: "1rem", display: "flex", alignItems: "center" }}>
      <TextField
        style={{ width: "100px" }}
        label="Hour"
        name="hour"
        onChange={handleChange}
        variant="outlined"
        size="small"
        sx={{ mr: "0.5rem" }}
      />
      <Button variant="contained" color="primary" onClick={handleModal} sx={{ mr: "0.5rem" }}>
        OFF
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleModalSubmit}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "ON"}
      </Button>
    </Box>
  )}
</Box>



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
                Bạn có chắc chắn muốn tự động lấy dữ liệu {form.hour} giờ/lần ?
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
    </>
  );
}

export default Search;
