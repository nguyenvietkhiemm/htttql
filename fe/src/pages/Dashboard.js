import React, { useState, useEffect } from "react";
import './style.css';
import Cookies from "js-cookie";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu sau khi lọc
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm

  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  // State cho tài liệu đã duyệt
  const [approvedDocs, setApprovedDocs] = useState([]);

  useEffect(() => {
    const tokenUser = Cookies.get("tokenUser");
    fetch("http://localhost:5000/document", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenUser}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.document) {
          setData(json.document);
          setFilteredData(json.document); // Ban đầu hiển thị tất cả
        }
      })
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err))
      .finally(() => setLoading(false));
  }, []);


  useEffect(() => {
    const tokenUser = Cookies.get("tokenUser");
    fetch("http://localhost:5000/document/approvedPublic", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenUser}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.document) {
          setApprovedDocs(json.document);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err))
      .finally(() => setLoading(false));
  }, []);



  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);

    const filtered = data.filter(item =>
      item.title.toLowerCase().includes(keyword)
    );
    setFilteredData(filtered);
  };

  const handleViewDetail = async () => {
    const tokenUser = Cookies.get("tokenUser");

    try {
      const res = await fetch(`http://localhost:5000/document/detail/${selectedItem.slug}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${tokenUser}`,
        },
      })      

      const blob = await res.blob();
      const pdfUrl = URL.createObjectURL(blob);
      setPdfUrl(pdfUrl);
      setShowPDF(true);
    } 
    catch (err) {
      alert("Lỗi khi xác thực người dùng.");
      console.error(err);
    }
  };

  const handleBuy = async () => {
    const tokenUser = Cookies.get("tokenUser");

    try {
      const res = await fetch(`http://localhost:5000/document/buy/${selectedItem.slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenUser}`,
        },
      })
      .then((res) => res.json())
      .then((json) => {
          alert(json.message);
      })
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err))
      .finally(() => setLoading(false));
    } 
    catch (err) {
      alert("Lỗi khi xác thực người dùng.");
      console.error(err);
    }
  };


  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

  return (
    <div className="dashboard-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm tài liệu..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Vùng chứa tài liệu đã được duyệt */}
      <div className="approved-docs-section">
        <h2>📄 Tài liệu đã được duyệt</h2>
        <div className="card-list approved">
          {approvedDocs.length === 0 && (
            <div className="no-approved">Không có tài liệu nào đã duyệt.</div>
          )}
          {approvedDocs.map((item) => (
            <div
              key={item._id}
              className="card"
              onClick={() => setSelectedItem(item)}
            >
              <img
                src={`http://localhost:5000/${item.thumbnail.startsWith("img\\") ? item.thumbnail.replace("img\\", "") : item.thumbnail}`}
                alt={item.title}
                className="card-thumbnail"
              />
              <h3>{item.title}</h3>
              <p>{item.description.substring(0, 80)}...</p>
            </div>
          ))}
        </div>
      </div>

      {/* Thanh ngang phân vùng */}
      <hr className="divider" />

      {/* Vùng chứa tất cả tài liệu */}
      <div className="card-list">
        {filteredData.map((item) => (
          <div
            key={item._id}
            className="card"
            onClick={() => setSelectedItem(item)}
          >
            <img
              src={`http://localhost:5000/${item.thumbnail.startsWith("img\\") ? item.thumbnail.replace("img\\", "") : item.thumbnail}`}
              alt={item.title}
              className="card-thumbnail"
            />
            <h3>{item.title}</h3>
            <p>{item.description.substring(0, 80)}...</p>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="details-card">
          <h2>{selectedItem.title}</h2>
          <p><strong>Mô tả:</strong> {selectedItem.description}</p>
          <p><strong>Trạng thái:</strong> {selectedItem.status}</p>
          <p><strong>Giá:</strong> {selectedItem.money}</p>
          <p><strong>Ngày tạo:</strong> {new Date(selectedItem.createdAt).toLocaleString()}</p>
          <img
            src={`http://localhost:5000/${selectedItem.thumbnail.startsWith("img\\") ? selectedItem.thumbnail.replace("img\\", "") : selectedItem.thumbnail}`}
            alt={selectedItem.title}
            className="thumbnail"
          />
          <div className="button-group">
            <button onClick={handleViewDetail} className="view-button">
              Xem chi tiết
            </button>
            <button onClick={handleBuy} className="view-button">
              Mua tài liệu
            </button>
            <button onClick={() => setSelectedItem(null)} className="close-button">
              Đóng
            </button>
          </div>
        </div>
      )}

      {showPDF && (
        <div className="pdf-modal">
          <div className="pdf-container">
            <iframe src={pdfUrl} title="Xem PDF" frameBorder="0"></iframe>
            <button onClick={() => setShowPDF(false)} className="close-button">Đóng tài liệu</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
