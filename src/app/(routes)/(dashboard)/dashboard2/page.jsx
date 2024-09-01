"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CreditCardIcon,
  DollarSignIcon,
  LineChartIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchLoans, fetchTransactions } from "@/utils/fetchingData";
import CurrentLoans from "@/components/(dashboard)/Dashboard/CurrentLoans";
import LatestTransactions from "@/components/(dashboard)/Dashboard/LatestTransactions";
import ExpenseCategoryChart from "@/components/(dashboard)/Dashboard/ExpenseCategoryChart";
import { COLORS } from "@/components/Colors";
import SpendingTrendChart from "@/components/(dashboard)/Dashboard/SpendingTrendChart";

const data = [
  { name: "Ene", ingresos: 4000, egresos: 2400 },
  { name: "Feb", ingresos: 3000, egresos: 1398 },
  { name: "Mar", ingresos: 2000, egresos: 9800 },
  { name: "Abr", ingresos: 2780, egresos: 3908 },
  { name: "May", ingresos: 1890, egresos: 4800 },
  { name: "Jun", ingresos: 2390, egresos: 3800 },
];



export default function DashboardPage() {
  const [loans, setLoans] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loansData = await fetchLoans();
        setLoans(loansData);

        const transactionsData = await fetchTransactions();
        setTransactions(transactionsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
            Dashboard Financiero
          </h2>
          <div className="flex items-center space-x-2">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <LineChartIcon className="mr-2 h-4 w-4" /> Generar Reporte
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Balance Total
              </CardTitle>
              <DollarSignIcon className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                $5,231.89
              </div>
              <p className="flex items-center text-xs text-green-500">
                <TrendingUpIcon className="mr-1 h-4 w-4" /> +20.1% del mes
                pasado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ingresos
              </CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                $3,500.00
              </div>
              <p className="flex items-center text-xs text-green-500">
                <TrendingUpIcon className="mr-1 h-4 w-4" /> +10.5% del mes
                pasado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Egresos
              </CardTitle>
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                $1,950.00
              </div>
              <p className="flex items-center text-xs text-red-500">
                <TrendingDownIcon className="mr-1 h-4 w-4" /> -5.2% del mes
                pasado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Préstamos Activos
              </CardTitle>
              <CreditCardIcon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                3
              </div>
              <p className="text-xs text-blue-500">Total: $3,500.00</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                Ingresos vs Egresos
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ingresos" fill="#10B981" />
                  <Bar dataKey="egresos" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="col-span-3">
            <CurrentLoans loans={loans} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* <Card className="col-span-4 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                Tendencia de Gastos
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="egresos"
                    stroke="#EF4444"
                    fill="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card> */}
          <div className="col-span-4">
            <SpendingTrendChart transactions={transactions} />
          </div>

          <div className="col-span-3">
            <ExpenseCategoryChart transactions={transactions} COLORS={COLORS} />
          </div>
        </div>

        <LatestTransactions transactions={transactions} />
      </div>
    </div>
  );
}
