"use client"

import React, { useState } from "react"
import { CardComponent } from "@/components/CardComponent"
import { Cell, Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { format, isWithinInterval, startOfMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import generateChartConfig from "@/utils/ChartConfig"
import NoDataDisplay from "@/components/NoDataDisplay/NoDataDisplay"
import { CalendarIcon, PieChartIcon } from "lucide-react"

// Función para filtrar transacciones por rango de fechas
const filterTransactionsByDateRange = (transactions, dateRange) => {
  if (!dateRange || !dateRange.from || !dateRange.to) return transactions
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)
    return isWithinInterval(transactionDate, { start: dateRange.from, end: dateRange.to })
  })
}

// Función para agrupar transacciones por categoría (solo egresos)
const groupTransactionsByCategory = (transactions) => {
  const groupedData = {}

  transactions.forEach((transaction) => {
    if (transaction.type === "egreso") {
      const { category, amount } = transaction
      if (groupedData[category]) {
        groupedData[category] += amount
      } else {
        groupedData[category] = amount
      }
    }
  })

  return Object.keys(groupedData).map((category) => ({
    name: category,
    value: groupedData[category],
  }))
}

export default function ExpenseCategoryChart({ transactions = [] }) {
  const [date, setDate] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  })

  // Filtrar transacciones para el rango de fechas seleccionado
  const filteredTransactions = filterTransactionsByDateRange(transactions, date)

  // Transformar las transacciones para agrupar por categoría
  const dataForChart = groupTransactionsByCategory(filteredTransactions)

  // Generar la configuración del gráfico
  const chartConfig = generateChartConfig(dataForChart)

  // Formatear el rango de fechas para el título y la descripción
  const formatDateRange = (range) => {
    if (!range || !range.from || !range.to) return "Rango no seleccionado"
    if (range.from.getMonth() === range.to.getMonth() && range.from.getFullYear() === range.to.getFullYear()) {
      return format(range.from, "MMMM yyyy", { locale: es })
    }
    return `${format(range.from, "dd LLL , y", { locale: es })} - ${format(range.to, "dd LLL, y", { locale: es })}`
  }

  return (
    <CardComponent
      title={`Gastos por Categoría (${formatDateRange(date)})`}
      description={`Distribución de gastos por categoría del ${formatDateRange(date)}`}
      className="h-full min-w-max shadow-lg"
    >
      <div className="mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd LLL, y", { locale: es })} -{" "}
                    {format(date.to, "dd LLL, y", { locale: es })}
                  </>
                ) : (
                  format(date.from, "dd LLL, y", { locale: es })
                )
              ) : (
                <span>Selecciona un rango de fechas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>
      {dataForChart.length === 0 ? (
        <NoDataDisplay
          icon={PieChartIcon}
          title="No hay datos disponibles"
          description={`No hay transacciones de egresos registradas en el período seleccionado para mostrar en este gráfico de gastos por categoría.`}
        />
      ) : (
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full max-h-[400px]"
        >
          <PieChart>
            <Pie
              data={dataForChart}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
            >
              {dataForChart.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartConfig[entry.name].color}
                />
              ))}
            </Pie>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="name" valueKey="value" />}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" valueKey="value" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      )}
    </CardComponent>
  )
}