import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

export default function page() {
  return (
    <div className="container mx-auto p-4">
      <h1>Users</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="pr-0 text-right">Actions</TableHead>
          </TableRow>
          
        </TableHeader>
        <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.created}</TableCell>
                <TableCell className="pr-0 text-right">
                  <Button variant="outline">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
      </Table>
    </div>
  );
}

const users = [
  {
    id: 1,
    name: "John Doe",
    role: "Admin",
    status: "Active",
    created: "2022-01-01",
  },
  {
    id: 2,
    name: "Jane Doe",
    role: "User",
    status: "Inactive",
    created: "2022-01-01",
  },
];
