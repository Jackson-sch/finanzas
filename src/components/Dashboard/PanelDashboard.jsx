"use client";
import React, { useEffect, useState } from "react";
import { subDays, isWithinInterval } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CreditCardIcon,
  DollarSignIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";
import { fetchLoans, fetchTransactions } from "@/utils/fetchingData";
import CurrentLoans from "@/components/Dashboard/CurrentLoans";
import LatestTransactions from "@/components/Dashboard/LatestTransactions";
import ExpenseCategoryChart from "@/components/Dashboard/ExpenseCategoryChart";
import { COLORS } from "@/components/Colors";
import SpendingTrendChart from "@/components/Dashboard/SpendingTrendChart";
import IncomeAndExpenseChart from "@/components/Dashboard/IncomeAndExpenseChart";
import { currencyFormatter } from "@/utils/CurrencyFormatter";
import StatCard from "@/components/Dashboard/StatCard";
import {
  calculatePercentageChange,
  calculateTotal,
} from "@/utils/auxiliaryFunctions";

export default function PanelDashboard({ session }) {
  const [loans, setLoans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balanceTotal, setBalanceTotal] = useState(0);
  const [balanceChange, setBalanceChange] = useState(0);
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);
  const [ingresoChange, setIngresoChange] = useState(0);
  const [egresoChange, setEgresoChange] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loansData = await fetchLoans();
        // filtrar solo prestamos que corresponden al usuario logueado en la sesión campo a comparar email
        const loansDataFiltered = loansData.filter(
          (loan) => loan.email === session.user.email,
        );
        setLoans(loansDataFiltered);

        const transactionsData = await fetchTransactions();
        // Filtra todas las transacciones del mismo usuario que ah iniciado sesión la validación sera a del email si ambos coinciden me los muestras
        const filteredTransactions = transactionsData.filter(
          (transaction) => transaction.email === session.user.email,
        );
        setTransactions(filteredTransactions);

        // Calcular ingresos y egresos totales de todas las transacciones
        const totalIngresos = calculateTotal(filteredTransactions, "ingreso");
        const totalEgresos = calculateTotal(filteredTransactions, "egreso");
        const totalBalance = totalIngresos - totalEgresos;

        // Calcular ingresos y egresos de los últimos 30 días
        const now = new Date();
        const thirtyDaysAgo = subDays(now, 30);
        const sixtyDaysAgo = subDays(now, 60);

        const last30DaysTransactions = filteredTransactions.filter(
          (transaction) =>
            isWithinInterval(new Date(transaction.date), {
              start: thirtyDaysAgo,
              end: now,
            }),
        );

        const previous30DaysTransactions = filteredTransactions.filter(
          (transaction) =>
            isWithinInterval(new Date(transaction.date), {
              start: sixtyDaysAgo,
              end: thirtyDaysAgo,
            }),
        );

        const last30DaysIngresos = calculateTotal(
          last30DaysTransactions,
          "ingreso",
        );
        const last30DaysEgresos = calculateTotal(
          last30DaysTransactions,
          "egreso",
        );
        const last30DaysBalance = last30DaysIngresos - last30DaysEgresos;

        const previous30DaysIngresos = calculateTotal(
          previous30DaysTransactions,
          "ingreso",
        );
        const previous30DaysEgresos = calculateTotal(
          previous30DaysTransactions,
          "egreso",
        );
        const previous30DaysBalance =
          previous30DaysIngresos - previous30DaysEgresos;

        // Calcular el porcentaje de cambio entre los últimos 30 días y los 30 días anteriores
        const ingresoChange = calculatePercentageChange(
          last30DaysIngresos,
          previous30DaysIngresos,
        );
        const egresoChange = calculatePercentageChange(
          last30DaysEgresos,
          previous30DaysEgresos,
        );
        const balanceChange = calculatePercentageChange(
          last30DaysBalance,
          previous30DaysBalance,
        );

        setBalanceTotal(totalBalance);
        setIngresos(totalIngresos);
        setEgresos(totalEgresos);
        setIngresoChange(ingresoChange);
        setEgresoChange(egresoChange);
        setBalanceChange(balanceChange);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [session?.user?.email]);

  return (
    <div className="flex flex-col gap-4 pt-3">
      <header className="flex items-center justify-between rounded-md bg-primary px-6 py-4 text-primary-foreground">
        <h1 className="text-xl font-bold md:text-2xl">Dashboard Financiero</h1>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Balance Total"
          amount={balanceTotal}
          change={balanceChange}
          icon={DollarSignIcon}
          changeIcon={balanceChange >= 0 ? TrendingUpIcon : TrendingDownIcon}
          changeColor={balanceChange >= 0 ? "text-green-500" : "text-red-500"}
        />
        <StatCard
          title="Ingresos"
          amount={ingresos}
          change={ingresoChange}
          icon={ArrowUpIcon}
          changeIcon={ingresoChange >= 0 ? TrendingUpIcon : TrendingDownIcon}
          changeColor={ingresoChange >= 0 ? "text-green-500" : "text-red-500"}
        />
        <StatCard
          title="Egresos"
          amount={egresos}
          change={egresoChange}
          icon={ArrowDownIcon}
          changeIcon={egresoChange >= 0 ? TrendingDownIcon : TrendingUpIcon}
          changeColor={egresoChange >= 0 ? "text-red-500" : "text-green-500"}
        />

        <Card className="bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Préstamos Activos
            </CardTitle>
            <CreditCardIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {loans.length}
            </div>
            <p className="text-xs text-blue-500">
              Total:{" "}
              {currencyFormatter.format(
                loans
                  .reduce((total, loan) => total + loan.amount, 0)
                  .toFixed(2),
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-7 md:col-span-4">
          <IncomeAndExpenseChart transactions={transactions} />
        </div>
        <div className="col-span-7 md:col-span-3 w-full">
          <CurrentLoans loans={loans} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-7 md:col-span-4">
          <SpendingTrendChart transactions={transactions} />
        </div>

        <div className="col-span-7 md:col-span-3">
          <ExpenseCategoryChart transactions={transactions}  />
        </div>
      </div>

      <LatestTransactions transactions={transactions} />
    </div>
  );
}
