import React, { useEffect, useState } from "react";
import './style.css';
import Cookies from "js-cookie";

const Review = () => {
  const [document, setDocument] = useState([]);
  const [role, setRole] = useState(0);

  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const [selectedDoc, setSelectedDoc] = useState(null); // tài liệu đang xét duyệt
  const [showReviewForm, setShowReviewForm] = useState(false); // hiển thị form xét duyệt
  const [comment, setComment] = useState(""); // nội dung xét duyệt

  useEffect(() => {
    const tokenUser = Cookies.get("tokenUser");
    fetch("http://localhost:5000/document", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenUser}`,
      },
    })
      .then(res => res.json())
      .then(json => {
        if (json.document) {
          setDocument(json.document);
        }
        if (json.role !== undefined) {
          setRole(json.role);
        }
      })
      .catch(err => console.error("Lỗi khi lấy dữ liệu:", err));
  }, []);


  
  const handleViewDetail = async (doc) => {
        const tokenUser = Cookies.get("tokenUser");
    
        try {
          const res = await fetch(`http://localhost:5000/document/detail/${doc.slug}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${tokenUser}`,
            },
          });
    
          if (!res.ok) {
            if (res.status === 403) {
              alert(res.message);
            }
            return;
          }
    
          const blob = await res.blob();
          const pdfUrl = URL.createObjectURL(blob);
          setPdfUrl(pdfUrl);
          setShowPDF(true);
        } catch (err) {
          alert("Lỗi khi xác thực người dùng.");
          console.error(err);
        }
      };


      const handleReviewClick = (doc) => {
        setSelectedDoc(doc);
        setShowReviewForm(true);
        setComment(""); // reset nội dung
      };

      const handleReviewSubmit = async (status) => {
        const tokenUser = Cookies.get("tokenUser");
        try {
          const res = await fetch(`http://localhost:5000/document/review/${selectedDoc.slug}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${tokenUser}`,
            },
            body: JSON.stringify({ status, comment }),
          });
    
          const json = await res.json();
          if (json.code === 200) {
            alert("Đã cập nhật trạng thái thành công!");
            setShowReviewForm(false);
            setDocument(prev =>
              prev.map(doc => doc._id === selectedDoc._id ? { ...doc, status } : doc)
            );
          } else {
            alert(json.message);
          }
        } catch (err) {
          alert("Lỗi máy chủ.");
          console.error(err);
        }
      };

      return (
        <div className="document-container">
          <h2>Duyệt tài liệu</h2>
    
          <div className="document-list list-view">
            {document.map(doc => (
              <div key={doc._id} className="document-row">
                {doc.thumbnail && (
                  <img
                    src={`http://localhost:5000/${doc.thumbnail.replace("img\\", "")}`}
                    alt={doc.title}
                    className="thumbnail-small"
                  />
                )}
                <div className="document-info">
                  <h3>{doc.title}</h3>
                  <p><strong>Mô tả:</strong>{doc.description?.substring(0, 100)}...</p>
                  <p><strong>Trạng thái:</strong> {doc.status || 'Không xác định'}</p>
                  <p><strong>Ngày tạo:</strong> {new Date(doc.createBy?.createAt).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Tác giả:</strong> {doc.createBy?.fullName || 'Không rõ'}</p>
                </div>
                <div className="button-group">
                  <button className="edit-btn" onClick={() => handleViewDetail(doc)}>Xem chi tiết</button>
                  <button className="review-btn" onClick={() => handleReviewClick(doc)}>Xét duyệt</button>
                </div>
              </div>
            ))}
          </div>
    
          {showPDF && (
            <div className="pdf-modal">
              <div className="pdf-container">
                <iframe src={pdfUrl} title="Xem PDF" frameBorder="0"></iframe>
                <button onClick={() => setShowPDF(false)} className="close-button">Đóng tài liệu</button>
              </div>
            </div>
          )}
    
        {showReviewForm && (
                <div className="modal-form">
                <h3>Xét duyệt tài liệu: {selectedDoc.title}</h3>
                <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Nhập nội dung nhận xét..."
                rows={4}
                style={{ width: '100%', marginBottom: '1rem' }}
                />
                <div className="form-buttons">
                <button onClick={() => handleReviewSubmit("approved")} className="submit-btn">✅ Đã duyệt</button>
                <button onClick={() => handleReviewSubmit("warning")} className="warning-btn">⚠️ Cảnh báo</button>
                <button onClick={() => handleReviewSubmit("rejected")} className="cancel-btn">❌ Từ chối</button>
                </div>
                <button onClick={() => setShowReviewForm(false)} className="close-button">Đóng</button>
                </div>
        )}

          
        </div>
      );
    };

export default Review;
