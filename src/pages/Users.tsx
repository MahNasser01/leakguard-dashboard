import { useState, useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, ArrowRight, Users as UsersIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock user data
interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  department: string;
  leaksDetected: number;
  lastActive: string;
}

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&mood[]=happy",
    department: "Engineering",
    leaksDetected: 12,
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&mood[]=happy",
    department: "Product",
    leaksDetected: 8,
    lastActive: "5 hours ago",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&mood[]=happy",
    department: "Marketing",
    leaksDetected: 23,
    lastActive: "1 day ago",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&mood[]=happy",
    department: "Engineering",
    leaksDetected: 5,
    lastActive: "3 hours ago",
  },
  {
    id: "5",
    name: "Jessica Martinez",
    email: "jessica.martinez@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&mood[]=happy",
    department: "Sales",
    leaksDetected: 15,
    lastActive: "30 minutes ago",
  },
  {
    id: "6",
    name: "Robert Taylor",
    email: "robert.taylor@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert&mood[]=happy",
    department: "Engineering",
    leaksDetected: 31,
    lastActive: "1 hour ago",
  },
  {
    id: "7",
    name: "Amanda White",
    email: "amanda.white@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda&mood[]=happy",
    department: "Product",
    leaksDetected: 7,
    lastActive: "4 hours ago",
  },
  {
    id: "8",
    name: "James Wilson",
    email: "james.wilson@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=James&mood[]=happy",
    department: "Marketing",
    leaksDetected: 19,
    lastActive: "2 days ago",
  },
  {
    id: "9",
    name: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&mood[]=happy",
    department: "Engineering",
    leaksDetected: 4,
    lastActive: "6 hours ago",
  },
  {
    id: "10",
    name: "Christopher Brown",
    email: "christopher.brown@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher&mood[]=happy",
    department: "Sales",
    leaksDetected: 27,
    lastActive: "45 minutes ago",
  },
];

const DEFAULT_ITEMS_PER_PAGE = 25;
const PAGE_OPTIONS = [10, 25, 50, 100];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getLeakBadgeVariant = (leaks: number) => {
  if (leaks === 0) return "secondary";
  if (leaks <= 5) return "default";
  if (leaks <= 15) return "outline";
  return "destructive";
};

export default function Users() {
  const [users] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(users.map((u) => u.department));
    return Array.from(depts).sort();
  }, [users]);

  // Filter and paginate users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.department.toLowerCase().includes(query)
      );
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((user) => user.department === departmentFilter);
    }

    // Reset page if needed
    if (filtered.length > 0 && currentPage > Math.ceil(filtered.length / itemsPerPage)) {
      setCurrentPage(1);
    } else if (filtered.length === 0) {
      setCurrentPage(1);
    }

    return filtered;
  }, [users, searchTerm, departmentFilter, itemsPerPage, currentPage]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const startItemIndex = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItemIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Calculate summary stats
  const totalLeaks = useMemo(() => {
    return users.reduce((sum, user) => sum + user.leaksDetected, 0);
  }, [users]);

  const avgLeaksPerUser = useMemo(() => {
    return users.length > 0 ? (totalLeaks / users.length).toFixed(1) : "0";
  }, [users, totalLeaks]);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Team Members</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and monitor users in your organization
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leaks Detected</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeaks}</div>
            <p className="text-xs text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Leaks per User</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgLeaksPerUser}</div>
            <p className="text-xs text-muted-foreground">KPI metric</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        {totalItems} user{totalItems !== 1 ? "s" : ""} found
      </div>

      {/* Users Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Leaks Detected</TableHead>
              <TableHead>Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.profilePicture} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.department}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getLeakBadgeVariant(user.leaksDetected)}>
                      {user.leaksDetected} {user.leaksDetected === 1 ? "leak" : "leaks"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          {totalItems === 0
            ? "No users found"
            : `Showing ${startItemIndex} to ${endItemIndex} of ${totalItems}`}
        </div>

        <div className="flex items-center rounded-lg border mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="h-8 rounded-r-none px-3"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <span className="px-4 text-sm font-medium border-l border-r h-8 flex items-center">
            {currentPage}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalItems === 0}
            className="h-8 rounded-l-none px-3"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Users per page</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

