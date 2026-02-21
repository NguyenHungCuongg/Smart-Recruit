import { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { FaSistrix, FaPlus, FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";

export const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"ALL" | "ADMIN" | "RECRUITER">("ALL");

  const users = [
    {
      id: 1,
      fullName: "Admin User",
      email: "admin@smartrecruit.com",
      role: "ADMIN",
      active: true,
      createdAt: "2024-01-15",
      lastLogin: "2024-02-13 14:30",
      jobCount: 0,
    },
    {
      id: 2,
      fullName: "John Smith",
      email: "john.smith@company.com",
      role: "RECRUITER",
      active: true,
      createdAt: "2024-01-20",
      lastLogin: "2024-02-13 10:15",
      jobCount: 12,
    },
    {
      id: 3,
      fullName: "Sarah Johnson",
      email: "sarah.j@company.com",
      role: "RECRUITER",
      active: true,
      createdAt: "2024-02-01",
      lastLogin: "2024-02-12 16:45",
      jobCount: 8,
    },
    {
      id: 4,
      fullName: "Mike Davis",
      email: "mike.d@company.com",
      role: "RECRUITER",
      active: false,
      createdAt: "2024-01-10",
      lastLogin: "2024-01-25 09:30",
      jobCount: 5,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "ALL" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    return role === "ADMIN" ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary";
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.active).length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    recruiters: users.filter((u) => u.role === "RECRUITER").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage system users and permissions</p>
          </div>
          <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2">
            <FaPlus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Users</p>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Active Users</p>
            <p className="text-3xl font-bold text-active">{stats.active}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Admins</p>
            <p className="text-3xl font-bold text-destructive">{stats.admins}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Recruiters</p>
            <p className="text-3xl font-bold text-chart-1">{stats.recruiters}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Search Users</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
                <FaSistrix className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Filter by Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as "ALL" | "ADMIN" | "RECRUITER")}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="RECRUITER">Recruiter</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Jobs</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Login</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.active ? (
                        <span className="px-3 py-1 bg-status-active/20 text-status-active rounded-full text-xs font-medium border border-status-active/20">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-status-inactive/20 text-status-inactive rounded-full text-xs font-medium">
                          INACTIVE
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-foreground font-medium">{user.jobCount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">{user.createdAt}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">{user.lastLogin}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Edit">
                          <FaRegPenToSquare className="w-4 h-4 text-primary" />
                        </button>
                        <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" title="Delete">
                          <FaRegTrashCan className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
