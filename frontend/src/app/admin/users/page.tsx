"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, ToggleLeft, ToggleRight, Trash2, Loader2, Mail, UserPlus, Key } from "lucide-react";
import { usersApi } from "@/lib/api";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [actionUserId, setActionUserId] = useState<number | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const getErrorMessage = (err: unknown, fallback: string) => {
    const apiError = err as { response?: { data?: { message?: string; error?: string } } };
    return apiError.response?.data?.message || apiError.response?.data?.error || fallback;
  };

  // Mutation to add a user
  const addUserMutation = useMutation({
    mutationFn: async (dto: typeof addForm) => {
      const res = await usersApi.create(dto);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User created successfully!");
      setIsAddModalOpen(false);
      setAddForm({ firstName: "", lastName: "", email: "", password: "" });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to create user."));
    },
  });

  // Fetch all users
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await usersApi.getAll();
      return res.data.data!;
    },
  });

  // Mutation to toggle user active status
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await usersApi.toggleStatus(id, isActive);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status toggled successfully.");
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to update user status."));
    },
    onSettled: () => setActionUserId(null),
  });

  // Mutation to delete a user
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await usersApi.delete(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted successfully.");
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to delete user."));
    },
    onSettled: () => setActionUserId(null),
  });

  const handleToggleStatus = (id: number, currentActive: boolean) => {
    setActionUserId(id);
    toggleStatusMutation.mutate({ id, isActive: !currentActive });
  };

  const handleDelete = (id: number) => {
    setDeleteUserId(id);
  };

  const confirmDelete = () => {
    if (deleteUserId) {
      setActionUserId(deleteUserId);
      deleteMutation.mutate(deleteUserId);
      setDeleteUserId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">User Management</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Add users and manage access to the admin portal.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 self-start sm:self-auto bg-brand-600 hover:bg-brand-700 text-white"
        >
          <UserPlus className="w-4 h-4" /> Add User
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          Failed to load users list. Please refresh the page.
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h2 className="text-sm font-semibold text-foreground">All Registered Users</h2>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            </div>
          ) : data && data.length === 0 ? (
            <p className="text-slate-500 text-center py-12 text-sm">No users registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-glass-border bg-black/5 dark:bg-white/2 text-slate-500 text-[10px] uppercase font-semibold tracking-wider">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                  {data?.map((u) => (
                    <tr key={u.id} className="text-xs hover:bg-black/5 dark:hover:bg-white/1 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-6 py-4 text-slate-500 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-600" />
                        <span>{u.email}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(u.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 font-semibold ${
                          u.isActive ? "text-emerald-500" : "text-slate-500"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-slate-500"}`} />
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        {/* Toggle Status */}
                        {u.email !== user?.email && (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u.id, u.isActive)}
                            className="p-1.5 hover:bg-white/5 rounded text-slate-500 hover:text-foreground transition-all"
                            title={u.isActive ? "Deactivate User" : "Activate User"}
                            disabled={actionUserId === u.id && toggleStatusMutation.isPending}
                          >
                            {u.isActive ? (
                              <ToggleRight className="w-5 h-5 text-brand-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </button>
                        )}

                        {/* Delete User */}
                        {u.email !== user?.email && (
                          <button
                            type="button"
                            onClick={() => handleDelete(u.id)}
                            className="p-1.5 hover:bg-red-500/10 rounded text-slate-500 hover:text-red-400 transition-all"
                            title="Delete User"
                            disabled={actionUserId === u.id && deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <ConfirmDialog
        open={deleteUserId !== null}
        onClose={() => setDeleteUserId(null)}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />

      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        description="Create a new user account with portal access."
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!addForm.firstName || !addForm.lastName || !addForm.email || !addForm.password) {
              toast.error("Please fill in all fields.");
              return;
            }
            addUserMutation.mutate(addForm);
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="add-firstname"
              label="First Name"
              placeholder="John"
              required
              value={addForm.firstName}
              onChange={(e) => setAddForm(prev => ({ ...prev, firstName: e.target.value }))}
            />
            <Input
              id="add-lastname"
              label="Last Name"
              placeholder="Doe"
              required
              value={addForm.lastName}
              onChange={(e) => setAddForm(prev => ({ ...prev, lastName: e.target.value }))}
            />
          </div>
          <Input
            id="add-email"
            label="Email Address"
            type="email"
            placeholder="john.doe@company.com"
            required
            leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
            value={addForm.email}
            onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input
            id="add-password"
            label="Password"
            type="password"
            placeholder="Enter secure password"
            required
            leftIcon={<Key className="w-4 h-4 text-slate-500" />}
            value={addForm.password}
            onChange={(e) => setAddForm(prev => ({ ...prev, password: e.target.value }))}
          />
          <div className="flex gap-3 justify-end mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
              disabled={addUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={addUserMutation.isPending}
              className="bg-brand-600 hover:bg-brand-700 text-white"
            >
              Create User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
