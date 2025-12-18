import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, UserX, Filter, Download, Users } from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser } from '../utils/api';
import toast from 'react-hot-toast';
import UserForm from './UserForm';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [userForm, setUserForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'candidate',
    status: 'active'
  });

  /* =========================
     FETCH USERS
  ========================== */
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FILTER USERS
  ========================== */
  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.full_name?.localeCompare(b.full_name);
        case 'role':
          return a.role?.localeCompare(b.role);
        case 'status':
          return a.status?.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredUsers(filtered);
  };

  /* =========================
     SUBMIT FORM
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          full_name: userForm.full_name,
          email: userForm.email,
          role: userForm.role,
          status: userForm.status
        });
        toast.success('User updated successfully');
      } else {
        await createUser(userForm);
        toast.success('User created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to save user');
    }
  };

  /* =========================
     EDIT USER
  ========================== */
  const handleEdit = (user) => {
    setEditingUser(user);
    setUserForm({
      full_name: user.full_name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'candidate',
      status: user.status || 'active'
    });
    setShowModal(true);
  };

  /* =========================
     DELETE USER
  ========================== */
  const handleDelete = async (userId, fullName) => {
    if (!window.confirm(`Delete ${fullName}? This action cannot be undone.`)) return;

    try {
      await deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  /* =========================
     RESET FORM
  ========================== */
  const resetForm = () => {
    setUserForm({
      full_name: '',
      email: '',
      password: '',
      role: 'candidate',
      status: 'active'
    });
    setEditingUser(null);
  };

  /* =========================
     BADGES
  ========================== */
  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border border-green-200',
      inactive: 'bg-red-100 text-red-800 border border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-gradient-to-r from-[#c13d18] to-[#e04e1a] text-white',
      recruiter: 'bg-orange-100 text-orange-800 border border-orange-200',
      candidate: 'bg-blue-100 text-blue-800 border border-blue-200'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    );
  };

  /* =========================
     STATS
  ========================== */
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    candidates: users.filter(u => u.role === 'candidate').length
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all users in the system</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2 text-white rounded-lg font-medium flex items-center gap-2 transition-all hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #c13d18 0%, #e04e1a 100%)',
              boxShadow: '0 4px 12px rgba(193, 61, 24, 0.25)'
            }}
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(193, 61, 24, 0.1)' }}>
              <Users className="h-5 w-5" style={{ color: '#c13d18' }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="p-2 rounded-lg bg-green-100">
              <Users className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
            </div>
            <div className="p-2 rounded-lg bg-red-100">
              <Users className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.candidates}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ focusRingColor: '#c13d18' }}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent appearance-none bg-white"
                style={{ focusRingColor: '#c13d18' }}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="recruiter">Recruiter</option>
                <option value="candidate">Candidate</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ focusRingColor: '#c13d18' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ focusRingColor: '#c13d18' }}
            >
              <option value="name">Sort by Name</option>
              <option value="role">Sort by Role</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#c13d18' }}></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <UserX className="h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-2 text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-10 w-10 rounded-full flex items-center justify-center font-semibold text-white"
                          style={{ background: 'linear-gradient(135deg, #c13d18 0%, #e04e1a 100%)' }}
                        >
                          {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.full_name || 'Unnamed User'}</p>
                          <p className="text-xs text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-700">{user.email}</p>
                      <p className="text-xs text-gray-500">Verified</p>
                    </td>
                    <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit user"
                        >
                          <Edit className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.full_name)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination/Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <p>Showing <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            1
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-100 font-medium">
            2
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            3
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Overlay */}
    <div 
      className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
      onClick={() => {
        setShowModal(false);
        resetForm();
      }}
    ></div>

    {/* Modal content */}
    <div className="relative bg-white rounded-xl shadow-lg max-w-lg w-full p-6 z-10 overflow-y-auto max-h-[90vh]">
      <h2 className="text-xl font-semibold mb-4">{editingUser ? 'Edit User' : 'Add New User'}</h2>
      <UserForm
        userForm={userForm}
        setUserForm={setUserForm}
        editingUser={editingUser}
        onSubmit={handleSubmit}
        onCancel={() => {
          setShowModal(false);
          resetForm();
        }}
      />
    </div>
  </div>
)}


    </div>
  );
}