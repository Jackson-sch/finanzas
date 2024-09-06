"use client";
import React, { useCallback, useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionForm from "./TransactionForm";
import { toast } from "@/components/ui/use-toast";
import {
  fetchCategories,
  fetchTags,
  fetchTransactions,
} from "@/utils/fetchingData";
import FinancialSummary from "./FinancialSummary";
import ListTransactions from "./ListTransactions";
import Categories from "../Categories/Categories";
import Tags from "../Tags/Tags";

export default function Transaction({ session }) {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [summaryPeriod, setSummaryPeriod] = useState("anual");
  const [summary, setSummary] = useState({
    ingresos: 0,
    egresos: 0,
    balance: 0,
  });
  const [previousSummary, setPreviousSummary] = useState({
    ingresos: 0,
    egresos: 0,
    balance: 0,
  });

  const handleApiRequest = async (url, method, data = null) => {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(url, options);

    if (!response.ok) throw new Error("Error en la respuesta de la API");
    return response.json();
  };

  const handleTransaction = async (
    method,
    url,
    data = null,
    successTitle,
    successDescription,
  ) => {
    try {
      const transaction = await handleApiRequest(url, method, data);
      toast({
        title: successTitle,
        status: "success",
        description: successDescription,
      });
      return transaction;
    } catch (error) {
      console.error("Error en la respuesta de la API:", error);
      toast({
        title: "Error en la respuesta de la API",
        status: "error",
        description: error.message,
      });
    }
  };

  const addTransaction = async (data) => {
    const transaction = await handleTransaction(
      "POST",
      "/api/transactions",
      data,
      "Transacción registrada",
      "La transacción se ha registrado correctamente",
    );
    if (transaction) {
      setTransactions([...transactions, transaction]);
      updateSummary([...transactions, transaction]);
    }
  };

  const updateTransaction = async (id, updatedData) => {
    const transaction = await handleTransaction(
      "PUT",
      `/api/transactions/${id}`,
      updatedData,
      "Transacción actualizada",
      "La transacción se ha actualizado correctamente",
    );

    if (transaction) {
      const updatedTransactions = transactions.map((t) =>
        t._id === id ? transaction : t,
      );
      setTransactions(updatedTransactions);
      updateSummary(updatedTransactions);
    }
  };

  const deleteTransaction = async (id) => {
    const success = await handleTransaction(
      "DELETE",
      `/api/transactions/${id}`,
      null,
      "Transacción eliminada",
      "La transacción se ha eliminado correctamente",
    );

    if (success) {
      const updatedTransactions = transactions.filter((t) => t._id !== id);
      setTransactions(updatedTransactions);
      updateSummary(updatedTransactions);
    }
  };

  const addCategory = async (data) => {
    const category = await handleTransaction(
      "POST",
      "/api/categories",
      data,
      "Categoría registrada",
      "La categoría se ha registrado correctamente",
    );

    if (category) {
      setCategories([...categories, category]);
    }
  };

  const deleteCategory = async (id) => {
    const success = await handleTransaction(
      "DELETE",
      `/api/categories/${id}`,
      null,
      "Categoría eliminada",
      "La categoría se ha eliminado correctamente",
    );

    if (success) {
      const updatedCategories = categories.filter((c) => c._id !== id);
      setCategories(updatedCategories);
    }
  };

  const addTag = async (data) => {
    const tag = await handleTransaction(
      "POST",
      "/api/tags",
      data,
      "Etiqueta registrada",
      "La etiqueta se ha registrado correctamente",
    );

    if (tag) {
      setTags([...tags, tag]);
    }
  };

  const deleteTag = async (id) => {
    const success = await handleTransaction(
      "DELETE",
      `/api/tags/${id}`,
      null,
      "Etiqueta eliminada",
      "La etiqueta se ha eliminado correctamente",
    );

    if (success) {
      const updatedTags = tags.filter((t) => t._id !== id);
      setTags(updatedTags);
    }
  };

  const updateSummary = useCallback((transactions) => {
    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "ingreso") {
          acc.ingresos += transaction.amount;
        } else {
          acc.egresos += transaction.amount;
        }
        return acc;
      },
      { ingresos: 0, egresos: 0 },
    );

    summary.balance = summary.ingresos - summary.egresos;
    setSummary(summary);
    fetchDataForPeriod(summaryPeriod, transactions); // Actualizar resumen para el período actual
  }, [summaryPeriod, fetchDataForPeriod]);


  // Función para obtener datos en función del período
  const fetchDataForPeriod = useCallback(async (period) => {
    let filteredTransactions = transactions;
    const today = new Date();
    // Filtrar transacciones según el período seleccionado
    switch (period) {
      case "diario":
        filteredTransactions = transactions.filter((transaction) => {
          // Lógica para filtrar las transacciones del día actual
          const transactionDate = new Date(transaction.date);
          return transactionDate.toDateString() === today.toDateString();
        });
        break;
      case "semanal":
        filteredTransactions = transactions.filter((transaction) => {
          // Lógica para filtrar las transacciones de la semana actual
          const today = new Date();
          const transactionDate = new Date(transaction.date);
          const oneWeekAgo = new Date(today);
          oneWeekAgo.setDate(today.getDate() - 7);
          return transactionDate >= oneWeekAgo && transactionDate <= today;
        });
        break;
      case "mensual":
        filteredTransactions = transactions.filter((transaction) => {
          // Lógica para filtrar las transacciones del mes actual
          const today = new Date();
          const transactionDate = new Date(transaction.date);
          return (
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear()
          );
        });
        break;
      case "anual":
        filteredTransactions = transactions.filter((transaction) => {
          // Lógica para filtrar las transacciones del año actual
          const today = new Date();
          const transactionDate = new Date(transaction.date);
          return transactionDate.getFullYear() === today.getFullYear();
        });
        break;
      default:
        break;
    }

    // Calcular los resúmenes para el período actual
    const currentSummary = filteredTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "ingreso") {
          acc.ingresos += transaction.amount;
        } else {
          acc.egresos += transaction.amount;
        }
        return acc;
      },
      { ingresos: 0, egresos: 0 },
    );
    currentSummary.balance = currentSummary.ingresos - currentSummary.egresos;
    setSummary(currentSummary);

    // Calcular los resúmenes para el período anterior
    // Aquí puedes adaptar la lógica para calcular el resumen del período anterior según el tipo de período seleccionado
    const previousSummary = calculatePreviousSummary(transactions, period);
    setPreviousSummary(previousSummary);
  }, [transactions]);

  const calculatePreviousSummary = (transactions, period) => {
    const currentDate = new Date();
    let lastPeriodDate;

    // Lógica para determinar la fecha de inicio del período anterior según el tipo de período seleccionado
    switch (period) {
      case "diario":
        lastPeriodDate = new Date(currentDate);
        lastPeriodDate.setDate(currentDate.getDate() - 1);
        break;
      case "semanal":
        lastPeriodDate = new Date(currentDate);
        lastPeriodDate.setDate(currentDate.getDate() - 7);
        break;
      case "mensual":
        lastPeriodDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1,
        );
        break;
      case "anual":
        lastPeriodDate = new Date(currentDate.getFullYear() - 1, 0, 1);
        break;
      default:
        lastPeriodDate = new Date(currentDate);
    }

    const lastPeriodTransactions = transactions.filter(
      (transaction) => new Date(transaction.date) < lastPeriodDate,
    );

    const previousSummary = lastPeriodTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "ingreso") {
          acc.ingresos += transaction.amount;
        } else {
          acc.egresos += transaction.amount;
        }
        return acc;
      },
      { ingresos: 0, egresos: 0 },
    );

    previousSummary.balance =
      previousSummary.ingresos - previousSummary.egresos;
    return previousSummary;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsData = await fetchTransactions();
        // Filtra las transacciones por usuario actual por su campo email
        const filteredTransactions = transactionsData.filter(
          (transaction) => transaction.email === session?.user?.email,
        );
        setTransactions(filteredTransactions);
        updateSummary(filteredTransactions);
        /* calculatePreviousSummary(filteredTransactions); */

        if (summaryPeriod) {
          fetchDataForPeriod(summaryPeriod); // Inicializar datos con el período seleccionado
        }

        const categoriesData = await fetchCategories();
        const filteredCategories = categoriesData.filter(
          (category) =>
            !category.isUserAdded || category.email === session?.user?.email,
        );
        setCategories(filteredCategories);

        const tagsData = await fetchTags();
        const filteredTags = tagsData.filter(
          (tag) => !tag.isUserAdded || tag.email === session?.user?.email,
        );
        setTags(filteredTags);
      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
      }
    };

    fetchData();
  }, [session?.user?.email, updateSummary, summaryPeriod, fetchDataForPeriod]);

  useEffect(() => {
    if (summaryPeriod) {
      fetchDataForPeriod(summaryPeriod, transactions);
    }
  }, [summaryPeriod, transactions, fetchDataForPeriod, updateSummary]);

  return (
    <div className="mx-auto space-y-8">
      <header className="flex items-center justify-between rounded-md bg-primary px-6 py-4 text-primary-foreground">
        <h1 className="text-2xl font-bold">Gestión de Ingresos y Egresos</h1>
      </header>

      <FinancialSummary
        setSummaryPeriod={setSummaryPeriod}
        summary={summary}
        previousSummary={previousSummary}
        fetchDataForPeriod={fetchDataForPeriod}
      />

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="tags">Etiquetas</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <TransactionForm
            transaction={selectedTransaction}
            categories={categories}
            tags={tags}
            addTransaction={addTransaction}
            updateTransaction={updateTransaction}
            session={session}
          />

          <ListTransactions
            transactions={transactions}
            deleteTransaction={deleteTransaction}
            setSelectedTransaction={setSelectedTransaction} // Pasar la función para seleccionar la transacción a editar
          />
        </TabsContent>

        <TabsContent value="categories">
          <Categories
            categories={categories}
            addCategory={addCategory}
            deleteCategory={deleteCategory}
            session={session}
          />
        </TabsContent>

        <TabsContent value="tags">
          <Tags
            tags={tags}
            addTag={addTag}
            deleteTag={deleteTag}
            session={session}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
