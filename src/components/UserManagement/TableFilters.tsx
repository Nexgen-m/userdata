import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search, Filter } from "lucide-react";

interface TableFiltersProps {
  onSearch?: (value: string) => void;
  onFilterRole?: (role: string) => void;
  onFilterStatus?: (status: string) => void;
}

const TableFilters = ({
  onSearch = () => {},
  onFilterRole = () => {},
  onFilterStatus = () => {},
}: TableFiltersProps) => {
  return (
    <div className="w-full min-h-[80px] bg-background p-4 border-b">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select onValueChange={onFilterRole} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={onFilterStatus} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              onFilterRole("all");
              onFilterStatus("all");
              onSearch("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableFilters;
