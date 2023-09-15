export function isProjectAdminFilter(userID: string) {
  return [
    {
      ownerId: userID,
    },
    {
      roles: {
        some: {
          users: {
            some: {
              id: userID,
            },
          },
          isAdmin: true,
        },
      },
    },
  ];
}
