// src/components/SuperAdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SuperAdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCompany, setNewCompany] = useState({ name: '' });
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'admin',
    company: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesRes = await axios.get('/api/companies');
        const usersRes = await axios.get('/api/users');
        setCompanies(companiesRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleCreateCompany = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/companies', newCompany);
      setCompanies([...companies, res.data]);
      setNewCompany({ name: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUser = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users', newUser);
      setUsers([...users, res.data]);
      setNewUser({
        email: '',
        password: '',
        role: 'admin',
        company: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="super-admin-dashboard">
      <h1>Super Admin Dashboard</h1>
      
      <section className="create-company">
        <h2>Create New Company</h2>
        <form onSubmit={handleCreateCompany}>
          <input
            type="text"
            placeholder="Company Name"
            value={newCompany.name}
            onChange={e => setNewCompany({ name: e.target.value })}
            required
          />
          <button type="submit">Create Company</button>
        </form>
      </section>

      <section className="create-user">
        <h2>Create New User</h2>
        <form onSubmit={handleCreateUser}>
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <select
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
            <option value="employee">Employee</option>
          </select>
          <select
            value={newUser.company}
            onChange={e => setNewUser({ ...newUser, company: e.target.value })}
            required
          >
            <option value="">Select Company</option>
            {companies.map(company => (
              <option key={company._id} value={company._id}>{company.name}</option>
            ))}
          </select>
          <button type="submit">Create User</button>
        </form>
      </section>

      <section className="companies-list">
        <h2>Companies</h2>
        <ul>
          {companies.map(company => (
            <li key={company._id}>{company.name}</li>
          ))}
        </ul>
      </section>

      <section className="users-list">
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{companies.find(c => c._id === user.company)?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default SuperAdminDashboard;