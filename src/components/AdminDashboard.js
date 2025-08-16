// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    password: '',
    role: 'employee'
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('/api/users/company-employees');
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, []);

  const handleCreateEmployee = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users', {
        ...newEmployee,
        company: localStorage.getItem('companyId')
      });
      setEmployees([...employees, res.data]);
      setNewEmployee({
        email: '',
        password: '',
        role: 'employee'
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <section className="create-employee">
        <h2>Create New Employee</h2>
        <form onSubmit={handleCreateEmployee}>
          <input
            type="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newEmployee.password}
            onChange={e => setNewEmployee({ ...newEmployee, password: e.target.value })}
            required
          />
          <select
            value={newEmployee.role}
            onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })}
          >
            <option value="employee">Employee</option>
            <option value="supervisor">Supervisor</option>
          </select>
          <button type="submit">Create Employee</button>
        </form>
      </section>

      <section className="employees-list">
        <h2>Employees</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee._id}>
                <td>{employee.email}</td>
                <td>{employee.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;