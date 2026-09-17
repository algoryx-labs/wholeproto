"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminUsers, getRoles } from "@westwinds/data";
import { formatDate } from "@westwinds/lib";
import {
  Badge,
  PageHeader,
  Skeleton,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@westwinds/ui";

export default function UsersPage() {
  const usersQ = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => getAdminUsers(),
  });
  const rolesQ = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
  });

  const roleName = (id: string) =>
    rolesQ.data?.find((r) => r.id === id)?.name ?? id;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & roles"
        description="Staff access for Westwinds Admin. Use View as role in the top bar to simulate permissions."
      />
      {usersQ.isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last login</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(usersQ.data ?? []).map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[10px] font-semibold text-[var(--primary)]">
                        {u.avatarInitials}
                      </span>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{roleName(u.roleId)}</Badge>
                  </TableCell>
                  <TableCell>
                    {u.lastLoginAt ? formatDate(u.lastLoginAt) : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={u.active ? "active" : "inactive"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
