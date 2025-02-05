import React, { useState, useEffect } from "react";
import UserTable from "./UserManagement/UserTable";
import AddUserDialog from "./UserManagement/AddUserDialog";
import EditUserDialog from "./UserManagement/EditUserDialog";
import DeleteConfirmationDialog from "./UserManagement/DeleteConfirmationDialog";
import TableFilters from "./UserManagement/TableFilters";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { frappeApi, User } from "@/lib/frappe";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const fetchedUsers = await frappeApi.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData: Omit<User, "id">) => {
    try {
      const newUser = await frappeApi.createUser(userData);
      setUsers([...users, newUser]);
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "User created successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create user. Please try again.",
      });
    }
  };

  const handleEditUser = async (updatedUser: User) => {
    try {
      await frappeApi.updateUser(updatedUser.id, updatedUser);
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
      );
      setShowEditDialog(false);
      setSelectedUser(null);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user. Please try again.",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await frappeApi.deleteUser(selectedUser.id);
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        setShowDeleteDialog(false);
        setSelectedUser(null);
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete user. Please try again.",
        });
      }
    }
  };

  const handleSearch = (searchTerm: string) => {
    // Implement search functionality
    console.log("Searching for:", searchTerm);
  };

  const handleFilterRole = (role: string) => {
    // Implement role filtering
    console.log("Filtering by role:", role);
  };

  const handleFilterStatus = (status: string) => {
    // Implement status filtering
    console.log("Filtering by status:", status);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="rounded-lg bg-white shadow">
        <div className="flex items-center justify-between border-b p-4 sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            User Management
          </h1>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        <TableFilters
          onSearch={handleSearch}
          onFilterRole={handleFilterRole}
          onFilterStatus={handleFilterStatus}
        />

        <UserTable
          users={users}
          onEdit={(user) => {
            setSelectedUser(user);
            setShowEditDialog(true);
          }}
          onDelete={(user) => {
            setSelectedUser(user);
            setShowDeleteDialog(true);
          }}
        />

        <AddUserDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSubmit={handleAddUser}
        />

        {selectedUser && (
          <>
            <EditUserDialog
              open={showEditDialog}
              onOpenChange={setShowEditDialog}
              user={selectedUser}
              onSave={handleEditUser}
              onCancel={() => {
                setShowEditDialog(false);
                setSelectedUser(null);
              }}
            />

            <DeleteConfirmationDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              onConfirm={handleDeleteUser}
              onCancel={() => {
                setShowDeleteDialog(false);
                setSelectedUser(null);
              }}
              userName={selectedUser.name}
            />
          </>
        )}
      </div>
    </div>
  );
}
