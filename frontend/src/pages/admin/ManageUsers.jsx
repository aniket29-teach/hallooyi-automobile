import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(r => setUsers(r.data));
  }, []);

  const changeRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role });
    toast.success('Role updated');
    window.location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr><th className="p-4 text-left">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-4">{u.name}</td>
                <td className="p-4 text-center">{u.email}</td>
                <td className="p-4 text-center capitalize">{u.role}</td>
                <td className="p-4 text-center">
                  <select className="border p-1 rounded" value={u.role} onChange={e => changeRole(u.id, e.target.value)}>
                    <option value="customer">Customer</option>
                    <option value="seller">Seller</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}