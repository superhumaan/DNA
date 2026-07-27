# RBAC Fundamentals

## Core concepts

- **Role:** named set of permissions (manager, hr, operations, admin)
- **Permission:** ability to perform an action on a resource
- **Resource:** route, API endpoint, menu item, notification type, button, data record
- **Default deny:** no access unless explicitly granted by an admin

## Permission matrix

Source of truth: feature/surface × role grid in `.DNA/CellularMemory/prefrontalCortex/rbac-permission-matrix.md`

Every layer must read from the same matrix:
1. API middleware
2. Server actions / route handlers
3. Frontend route guards
4. Menu and sidebar rendering
5. Notification feeds
6. Action buttons and widgets

## Role management

Document where admins:
- Invite users
- Assign roles
- Revoke access

No employee should access the platform until an admin grants a role.
