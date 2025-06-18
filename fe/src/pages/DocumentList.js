import React, { useEffect, useState } from "react";
import './style.css';
import Cookies from "js-cookie";

const DocumentList = () => {
  const [document, setDocument] = useState([]);
  const [role, setRole] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: null,
    money: 50000,
    thumbnail: null,
    documentFile: null,
  });



  useEffect(() => {
    const tokenUser = Cookies.get("tokenUser");
    fetch("http://localhost:5000/document/myDocument", {
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



  const handleAddClick = () => {
    setFormData({ title: "", description: "", thumbnail: null, documentFile: null });
    setShowForm(true);
    setIsEdit(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCancel = () => {
    setFormData({ title: "", description: "", thumbnail: null, documentFile: null });
    setShowForm(false);
    setIsEdit(false);
    setEditId(null);
  };

  const handleEditClick = (doc) => {
    setFormData({
      title: doc.title,
      description: doc.description,
      money: doc.money,
      thumbnail: null,
      documentFile: null,
    });
    setEditId(doc._id);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleDeleteClick = async (doc) => {
    if (role < doc.check) {
      alert("Bạn không có quyền xóa tài liệu này");
      return;
    }

    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tài liệu này?");
    if (!confirmDelete) return;

    const tokenUser = Cookies.get("tokenUser");

    try {
      const res = await fetch("http://localhost:5000/document/delete-item", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenUser}`,
        },
        body: JSON.stringify({ id: doc._id }),
      });

      const result = await res.json();
      alert(result.message || "Xóa thành công!");

      window.location.reload();
    } catch (error) {
      alert("Lỗi khi xóa tài liệu");
      console.error(error);
    }
  };



  const handleSubmit = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("money", formData.money);
    data.append("_id", editId);

    if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);
    if (formData.documentFile) data.append("documentFile", formData.documentFile);

    try {
      const url = isEdit
        ? `http://localhost:5000/document/edit`
        : "http://localhost:5000/document/createPost";
      const method = isEdit ? "PATCH" : "POST";
      const tokenUser = Cookies.get("tokenUser");
      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${tokenUser}`,
        },
        body: data,
      });

      const result = await res.json();
      alert(result.message || (isEdit ? "Cập nhật thành công" : "Tạo tài liệu thành công"));

      if (isEdit) {
        setDocument(prev =>
          prev.map(doc => (doc._id === editId ? { ...doc, ...result.document } : doc))
        );
      } else {
        setDocument(prev => [...prev, result.document]);
      }

      handleCancel();
    } catch (error) {
      alert(isEdit ? "Lỗi khi cập nhật" : "Lỗi khi tạo tài liệu");
      console.error(error);
    }
  };



  return (
    <div className="document-container">
      <h2>Danh sách tài liệu</h2>
      <button onClick={handleAddClick} className="add-button">+ Thêm tài liệu</button>


      <div className="document-list list-view">
        {document.map(doc => (
          <div key={doc._id} className="document-row">
            {doc.thumbnail && (
              <img
                src={`http://localhost:5000/${doc.thumbnail.startsWith("img\\") ? doc.thumbnail.replace("img\\", "") : doc.thumbnail}`}
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
              <button className="edit-btn" onClick={() => handleEditClick(doc)}>Sửa</button>
              <button className="delete-btn" onClick={() => handleDeleteClick(doc)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>



      {showForm && (
        <div className="modal-form">
          <h3>{isEdit ? "Chỉnh sửa tài liệu" : "Thêm tài liệu"}</h3>
          <input
            type="text"
            name="title"
            placeholder="Tên tài liệu"
            value={formData.title}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Mô tả"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          <h4>Ảnh (tải ảnh mới nếu muốn thay)</h4>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
          />
          <h4>Tài liệu (tải tài liệu mới nếu muốn thay)</h4>
          <input
            type="file"
            name="documentFile"
            onChange={handleChange}
          />
          <h4>Giá bán</h4>
          <input
            type="number"
            name="money"
            value={formData.money}
            onChange={handleChange}
          />
          <div className="form-buttons">
            <button onClick={handleSubmit} className="submit-btn">Xác nhận</button>
            <button onClick={handleCancel} className="cancel-btn">Hủy</button>
          </div>
        </div>
      )}


    </div>
  );
};

export default DocumentList;
