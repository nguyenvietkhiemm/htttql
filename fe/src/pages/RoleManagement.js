import React, { useEffect, useState } from 'react';
import './PhanQuyen.css'; // Import CSS file for styling

const RoleManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/role');
      const data = await response.json();
      if (data.code === 200) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch('http://localhost:5000/role/permission', {
        method:  'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          role: newRole,
        }),
      });

      const result = await response.json();
      if (result.code === 200) {
        setUsers(users.map(user =>
          user._id === userId ? { ...user, role: newRole } : user
        ));
        alert('Cập nhật thành công!');
      } else {
        alert('Cập nhật thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật role:', error);
    }
  };
  if (loading) return <p>Đang tải danh sách người dùng...</p>;

  return (
    <div className="role-page">
      <h2>Quản lý phân quyền người dùng</h2>
      <table className="role-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai Trò</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className={user.role === 2 ? 'manager-row' : 'user-row'}>
              <td>{user.fullName || 'Không có tên'}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role === 2 ? 2 : 1} // Rõ ràng hóa việc gán giá trị mặc định
                  onChange={e => handleRoleChange(user._id, Number(e.target.value))}
                >
                  <option value={1}>User</option>
                  <option value={2}>Manager</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagementPage;
