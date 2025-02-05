import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Dialog } from "../ui/dialog";
import { AlertDialog } from "../ui/alert-dialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserTableProps {
  users?: User[];
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onSort?: (column: keyof User) => void;
}

const defaultUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Editor",
    status: "Active",
  },
];

const UserTable = ({
  users = defaultUsers,
  onEdit = () => {},
  onDelete = () => {},
  onSort = () => {},
}: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg shadow">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="px-4 py-2 border rounded-md flex-1"
        />
        <select className="px-4 py-2 border rounded-md">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="editor">Editor</option>
        </select>
        <select className="px-4 py-2 border rounded-md">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="mt-4 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button variant="ghost" onClick={() => onSort("name")}>
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => onSort("email")}>
                  Email
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => onSort("role")}>
                  Role
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => onSort("status")}>
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit user</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete user</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <>
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Edit User</h2>
              {/* Placeholder for edit form */}
              <div className="space-y-4">
                <input
                  type="text"
                  defaultValue={selectedUser.name}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="email"
                  defaultValue={selectedUser.email}
                  className="w-full px-3 py-2 border rounded"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowEditDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setShowEditDialog(false)}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </Dialog>

          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Delete User</h2>
              <p className="mb-4">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(selectedUser.id);
                    setShowDeleteDialog(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default UserTable;
