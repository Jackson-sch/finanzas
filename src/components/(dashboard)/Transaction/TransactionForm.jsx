/**
 * v0 by Vercel.
 * @see https://v0.dev/t/a6to5uzur1W
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function TransactionForm() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: "2023-05-01",
      amount: 50.0,
      category: "Comida",
      description: "Almuerzo en el restaurante",
    },
    {
      id: 2,
      date: "2023-05-03",
      amount: 25.0,
      category: "Transporte",
      description: "Pasaje de autobús",
    },
    {
      id: 3,
      date: "2023-05-05",
      amount: 80.0,
      category: "Ropa",
      description: "Compra de camisas",
    },
  ])
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    date: "",
    amount: "",
    category: "",
    description: "",
  })
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category)
  }
  const handleShowForm = () => {
    setShowForm(true)
  }
  const handleCloseForm = () => {
    setShowForm(false)
    setFormData({
      id: null,
      date: "",
      amount: "",
      category: "",
      description: "",
    })
  }
  const handleAddTransaction = () => {
    const newTransaction = {
      id: transactions.length + 1,
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
    }
    setTransactions([...transactions, newTransaction])
    handleCloseForm()
  }
  const handleEditTransaction = (id) => {
    const transaction = transactions.find((t) => t.id === id)
    setFormData({
      id: transaction.id,
      date: transaction.date,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
    })
    setShowForm(true)
  }
  const handleUpdateTransaction = () => {
    const updatedTransactions = transactions.map((t) => {
      if (t.id === formData.id) {
        return {
          id: t.id,
          date: formData.date,
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
        }
      }
      return t
    })
    setTransactions(updatedTransactions)
    handleCloseForm()
  }
  const handleDeleteTransaction = (id) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id)
    setTransactions(updatedTransactions)
  }
  const filteredTransactions =
    selectedCategory === "Todas" ? transactions : transactions.filter((t) => t.category === selectedCategory)
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Registro de Transacciones</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleCategoryFilter("Todas")}
            className={selectedCategory === "Todas" ? "bg-primary text-primary-foreground" : ""}
          >
            Todas
          </Button>
          <Button
            variant="outline"
            onClick={() => handleCategoryFilter("Comida")}
            className={selectedCategory === "Comida" ? "bg-primary text-primary-foreground" : ""}
          >
            Comida
          </Button>
          <Button
            variant="outline"
            onClick={() => handleCategoryFilter("Transporte")}
            className={selectedCategory === "Transporte" ? "bg-primary text-primary-foreground" : ""}
          >
            Transporte
          </Button>
          <Button
            variant="outline"
            onClick={() => handleCategoryFilter("Ropa")}
            className={selectedCategory === "Ropa" ? "bg-primary text-primary-foreground" : ""}
          >
            Ropa
          </Button>
        </div>
        <Button onClick={handleShowForm}>Agregar Transacción</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Monto</th>
              <th className="px-4 py-2 text-left">Categoría</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b">
                <td className="px-4 py-2">{transaction.date}</td>
                <td className="px-4 py-2">${transaction.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{transaction.category}</td>
                <td className="px-4 py-2">{transaction.description}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditTransaction(transaction.id)}>
                      <FilePenIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteTransaction(transaction.id)}>
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-muted/50">
          <Card className="w-full max-w-md p-6">
            <CardHeader>
              <CardTitle>{formData.id ? "Editar Transacci\u00F3n" : "Agregar Transacci\u00F3n"}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  id="category"
                  value={formData.category}
                  onValueChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Comida">Comida</SelectItem>
                    <SelectItem value="Transporte">Transporte</SelectItem>
                    <SelectItem value="Ropa">Ropa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseForm}>
                Cancelar
              </Button>
              {formData.id ? (
                <Button onClick={handleUpdateTransaction}>Actualizar</Button>
              ) : (
                <Button onClick={handleAddTransaction}>Agregar</Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  )
}


function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}