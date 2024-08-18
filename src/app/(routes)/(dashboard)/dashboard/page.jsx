import { auth } from "@/auth";
import LogoutButton from "@/app/(auth)/components/LogoutButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 bg-gray-100">
        <div className="grid gap-6 p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-semibold">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">$45,567.45</p>
                <p className="text-sm font-normal text-muted-foreground">
                  +23.45% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-semibold">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">$45,567.45</p>
                <p className="text-sm font-normal text-muted-foreground">
                  +23.45% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-semibold">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">$45,567.45</p>
                <p className="text-sm font-normal text-muted-foreground">
                  +23.45% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-semibold">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">$45,567.45</p>
                <p className="text-sm font-normal text-muted-foreground">
                  +23.45% from last month
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-semibold">
                  Recent Signups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.plan}</TableCell>
                        <TableCell>{user.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Crea usuarios ficticios
const users = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    plan: "Premium",
    date: "2023-01-15",
  },
  {
    id: "2",
    name: "María Gómez",
    email: "maria.gomez@example.com",
    plan: "Basic",
    date: "2023-02-20",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@example.com",
    plan: "Standard",
    date: "2023-03-10",
  },
  {
    id: "4",
    name: "Laura Martínez",
    email: "laura.martinez@example.com",
    plan: "Premium",
    date: "2023-04-05",
  },
  {
    id: "5",
    name: "Luis Hernández",
    email: "luis.hernandez@example.com",
    plan: "Basic",
    date: "2023-05-12",
  },
  {
    id: "6",
    name: "Ana Sánchez",
    email: "ana.sanchez@example.com",
    plan: "Standard",
    date: "2023-06-18",
  },
  {
    id: "7",
    name: "Jorge Torres",
    email: "jorge.torres@example.com",
    plan: "Premium",
    date: "2023-07-22",
  },
  {
    id: "8",
    name: "Claudia Díaz",
    email: "claudia.diaz@example.com",
    plan: "Basic",
    date: "2023-08-30",
  },
  {
    id: "9",
    name: "Pedro Moreno",
    email: "pedro.moreno@example.com",
    plan: "Standard",
    date: "2023-09-14",
  },
  {
    id: "10",
    name: "Isabel Ruiz",
    email: "isabel.ruiz@example.com",
    plan: "Premium",
    date: "2023-10-01",
  },
  {
    id: "11",
    name: "Diego Ortega",
    email: "diego.ortega@example.com",
    plan: "Basic",
    date: "2023-10-20",
  },
  {
    id: "12",
    name: "Sofía Castro",
    email: "sofia.castro@example.com",
    plan: "Standard",
    date: "2023-11-12",
  },
  {
    id: "13",
    name: "Andrés Romero",
    email: "andres.romero@example.com",
    plan: "Premium",
    date: "2023-12-05",
  },
  {
    id: "14",
    name: "Verónica Silva",
    email: "veronica.silva@example.com",
    plan: "Basic",
    date: "2023-12-22",
  },
  {
    id: "15",
    name: "Fernando Delgado",
    email: "fernando.delgado@example.com",
    plan: "Standard",
    date: "2024-01-10",
  },
  {
    id: "16",
    name: "Gabriela Mendoza",
    email: "gabriela.mendoza@example.com",
    plan: "Premium",
    date: "2024-02-02",
  },
  {
    id: "17",
    name: "Ricardo Aguirre",
    email: "ricardo.aguirre@example.com",
    plan: "Basic",
    date: "2024-02-18",
  },
  {
    id: "18",
    name: "Patricia Peña",
    email: "patricia.pena@example.com",
    plan: "Standard",
    date: "2024-03-07",
  },
  {
    id: "19",
    name: "Samuel Paredes",
    email: "samuel.paredes@example.com",
    plan: "Premium",
    date: "2024-04-01",
  },
  {
    id: "20",
    name: "Natalia Ríos",
    email: "natalia.rios@example.com",
    plan: "Basic",
    date: "2024-04-20",
  },
  {
    id: "21",
    name: "Cristian Cordero",
    email: "cristian.cordero@example.com",
    plan: "Standard",
    date: "2024-05-15",
  },
];
