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

  const calculateSummary = useCallback((filteredTransactions) => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "ingreso") {
          acc.ingresos += transaction.amount;
        } else {
          acc.egresos += transaction.amount;
        }
        acc.balance = acc.ingresos - acc.egresos;
        return acc;
      },
      { ingresos: 0, egresos: 0, balance: 0 },
    );
  }, []);

  const filterTransactionsByPeriod = useCallback((transactions, period) => {
    if (!transactions || !Array.isArray(transactions)) {
      console.warn("Transactions is undefined or not an array");
      return [];
    }

    const today = new Date();
    switch (period) {
      case "diario":
        return transactions.filter(
          (transaction) =>
            new Date(transaction.date).toDateString() === today.toDateString(),
        );
      case "semanal":
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return transactions.filter(
          (transaction) =>
            new Date(transaction.date) >= oneWeekAgo &&
            new Date(transaction.date) <= today,
        );
      case "mensual":
        return transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return (
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear()
          );
        });
      case "anual":
        return transactions.filter(
          (transaction) =>
            new Date(transaction.date).getFullYear() === today.getFullYear(),
        );
      default:
        return transactions;
    }
  }, []);

  const calculatePreviousSummary = useCallback(
    (transactions, period) => {
      const currentDate = new Date();
      let lastPeriodDate;

      switch (period) {
        case "diario":
          lastPeriodDate = new Date(
            currentDate.setDate(currentDate.getDate() - 1),
          );
          break;
        case "semanal":
          lastPeriodDate = new Date(
            currentDate.setDate(currentDate.getDate() - 7),
          );
          break;
        case "mensual":
          lastPeriodDate = new Date(
            currentDate.setMonth(currentDate.getMonth() - 1),
          );
          break;
        case "anual":
          lastPeriodDate = new Date(
            currentDate.setFullYear(currentDate.getFullYear() - 1),
          );
          break;
        default:
          lastPeriodDate = new Date(currentDate);
      }

      const lastPeriodTransactions = transactions.filter(
        (transaction) => new Date(transaction.date) < lastPeriodDate,
      );

      return calculateSummary(lastPeriodTransactions);
    },
    [calculateSummary],
  );

  const fetchDataForPeriod = useCallback(
    (period, transactionsData) => {
      if (!transactionsData || !Array.isArray(transactionsData)) {
        console.warn("TransactionsData is undefined or not an array");
        setSummary({ ingresos: 0, egresos: 0, balance: 0 });
        setPreviousSummary({ ingresos: 0, egresos: 0, balance: 0 });
        return;
      }

      const filteredTransactions = filterTransactionsByPeriod(
        transactionsData,
        period,
      );
      const currentSummary = calculateSummary(filteredTransactions);
      setSummary(currentSummary);

      const previousSummary = calculatePreviousSummary(
        transactionsData,
        period,
      );
      setPreviousSummary(previousSummary);
    },
    [filterTransactionsByPeriod, calculateSummary, calculatePreviousSummary],
  );

  const updateSummary = useCallback(
    (transactions) => {
      const summary = calculateSummary(transactions);
      setSummary(summary);
      fetchDataForPeriod(summaryPeriod, transactions);
    },
    [summaryPeriod, fetchDataForPeriod, calculateSummary],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsData = await fetchTransactions();
        if (transactionsData && Array.isArray(transactionsData)) {
          const filteredTransactions = transactionsData.filter(
            (transaction) => transaction.email === session?.user?.email,
          );
          setTransactions(filteredTransactions);
          updateSummary(filteredTransactions);

          if (summaryPeriod) {
            fetchDataForPeriod(summaryPeriod, filteredTransactions);
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
        } else {
          console.warn(
            "Fetched transactions data is undefined or not an array",
          );
          setTransactions([]);
        }

        // ... resto del código para categorías y tags
      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
        setTransactions([]);
      }
    };

    fetchData();
  }, [session?.user?.email, updateSummary, fetchDataForPeriod, summaryPeriod]);

  useEffect(() => {
    if (summaryPeriod && transactions.length > 0) {
      fetchDataForPeriod(summaryPeriod, transactions);
    }
  }, [summaryPeriod, transactions, fetchDataForPeriod]);

  return (
    <div className="mx-auto space-y-8">
      <header className="flex items-center justify-between rounded-md bg-primary px-6 py-4 text-primary-foreground">
        <h1 className=" md:text-2xl font-bold">Gestión de Ingresos y Egresos</h1>
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
