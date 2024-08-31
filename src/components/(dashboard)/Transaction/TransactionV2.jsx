import React, { useEffect, useState } from "react";

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
import Categories from "./Categories";
import Tags from "./Tags";
import { set } from "mongoose";

export default function TransactionV2() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [summaryPeriod, setSummaryPeriod] = useState("mensual");
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

  const addTransaction = async (data) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast({
          title: "Transacción registrada",
          description: "La transacción ha sido registrada exitosamente",
          status: "success",
        });
        const data = await response.json();
        setTransactions([...transactions, data]);
        updateSummary([...transactions, data]);
      } else {
        toast({
          title: "Error",
          description: "Ocurrió un error al registrar la transacción",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error al registrar la transacción:", error.message);
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar la transacción",
        status: "error",
      });
    }
  };

  const updateTransaction = async (id, updatedData) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        toast({
          title: "Transacción actualizada",
          description: "La transacción ha sido actualizada exitosamente",
          status: "success",
        });
        const updatedTransaction = await response.json();
        const updatedTransactions = transactions.map((transaction) =>
          transaction._id === id ? updatedTransaction : transaction,
        );
        setTransactions(updatedTransactions);
        updateSummary(updatedTransactions);
        setSelectedTransaction(null);
      } else {
        toast({
          title: "Error",
          description: "Ocurrió un error al actualizar la transacción",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error al actualizar la transacción:", error.message);
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar la transacción",
        status: "error",
      });
    }
  };

  const handleEditTransaction = (transaction) => {
    setTransactions(transaction);
  };

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Ocurrió un error al eliminar la transacción");
      }

      const updatedTransactions = transactions.filter((t) => t._id !== id);
      toast({
        title: "Transacción eliminada",
        description: "La transacción ha sido eliminada correctamente",
        status: "success",
      });
      setTransactions(updatedTransactions);
      updateSummary(updatedTransactions);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Ocurrió un error al eliminar la transacción " + error.message,
        status: "error",
      });
    }
  };

  const addCategory = async (data) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Categoría registrada",
          description: "La categoría se ha registrado correctamente",
          status: "success",
        });
        setCategories([...categories, data]);
      } else {
        toast({
          title: "Error",
          description: "Ocurrió un error al registrar la categoría",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error al registrar la categoría:", error.message);
      toast({
        title: "Error",
        description:
          "Ocurrió un error al registrar la categoría" + error.message,
        status: "error",
      });
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Ocurrió un error al eliminar la categoría");
      }

      const updatedCategories = categories.filter((c) => c._id !== id);

      toast({
        title: "Categoría eliminada",
        description: "La categoría se ha eliminado correctamente",
        status: "success",
      });

      setCategories(updatedCategories);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Ocurrió un error al eliminar la categoría" + error.message,
        status: "error",
      });
    }
  };

  const addTag = async (data) => {
    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Etiqueta registrada",
          description: "La etiqueta se ha registrado correctamente",
          status: "success",
        });
        setTags([...tags, data]);
      } else {
        toast({
          title: "Error",
          description: "Ocurrió un error al registrar la etiqueta",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error al registrar la etiqueta:", error.message);
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar la etiqueta",
        status: "error",
      });
    }
  };

  const deleteTag = async (id) => {
    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Ocurrió un error al eliminar la etiqueta");
      }

      const updatedTags = tags.filter((t) => t._id !== id);
      toast({
        title: "Etiqueta eliminada",
        description: "La etiqueta se ha eliminado correctamente",
        status: "success",
      });

      setTags(updatedTags);
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la etiqueta",
        status: "error",
      });
    }
  };

  const updateSummary = (transactions) => {
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
  };

  const calculatePreviousSummary = (transactions) => {
    const currentDate = new Date();
    const lastMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );

    const lastMonthTransactions = transactions.filter(
      (transaction) => new Date(transaction.date) < lastMonthDate,
    );

    const previousSummary = lastMonthTransactions.reduce(
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
    setPreviousSummary(previousSummary);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsData = await fetchTransactions();
        setTransactions(transactionsData);
        updateSummary(transactionsData);
        calculatePreviousSummary(transactionsData);

        const categoriesData = await fetchCategories();
        setCategories(categoriesData);

        const tagsData = await fetchTags();
        setTags(tagsData);
      } catch (error) {
        console.error("Error al obtener las transacciones:", error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto space-y-8 p-4">
      <h1 className="mb-6 text-3xl font-bold">Gestión de Ingresos y Egresos</h1>

      <FinancialSummary
        setSummaryPeriod={setSummaryPeriod}
        summary={summary}
        previousSummary={previousSummary}
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
          />
        </TabsContent>

        <TabsContent value="tags">
          <Tags tags={tags} addTag={addTag} deleteTag={deleteTag} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
