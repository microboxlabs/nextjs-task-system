"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserGroupContext } from "@/contexts/UsersGroupsContext";
import { UserRoleValues } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GroupManagementDialog } from "@/components/dashboard/group-management";
export default function UserListView() {
  const { users, groups, changeUserRole } = useUserGroupContext();
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold">User Management</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users &&
          users.map((user) => (
            <Card key={user.id} className="w-full">
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Role
                    </p>
                    <Select
                      onValueChange={(value) => changeUserRole(user.id, value)}
                      defaultValue={user.role}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(UserRoleValues).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Groups
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {user.groupMemberships &&
                        user.groupMemberships.map((membership) => (
                          <Badge
                            key={membership.id}
                            variant="secondary"
                            className={`${membership.group && groups?.includes(membership.group) && "line-through"}`}
                          >
                            {membership.group?.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <GroupManagementDialog user={user} allGroups={groups || []} />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
