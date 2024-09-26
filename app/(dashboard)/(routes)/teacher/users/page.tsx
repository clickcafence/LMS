import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getTeacherUsers } from "@/actions/getTeacherUsers";
import { auth } from '@clerk/nextjs/server'

// This component runs on the server, so you can safely use Prisma here
const UsersPage = async () => {
  const { userId } = auth();  // auth() can only be used server-side
  const userData = await getTeacherUsers(userId || '');  // Prisma can be used here safely

  return (
    <div className="p-6">
      <h1>Users</h1>
      <DataTable columns={columns} data={userData} />
    </div>
  );
};

export default UsersPage;