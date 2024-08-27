
import React from 'react'
import { 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  Wallet, 
  Target, 
  CreditCard, 
  AlertTriangle,
  LineChart
} from 'react-feather'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function FinanceDashboard() {
  return (
    <div className="p-4 bg-background">
      <h1 className="text-3xl font-bold mb-6">Dashboard Financiero Personal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Resumen de saldo actual */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Actual</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345.67</div>
            <p className="text-xs text-muted-foreground">+2.5% desde el mes pasado</p>
          </CardContent>
        </Card>

        {/* Ingresos vs. Gastos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos vs. Gastos</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Ingresos: $5,000</div>
            <div className="text-sm font-medium">Gastos: $3,500</div>
            <Progress value={70} className="mt-2" />
          </CardContent>
        </Card>

        {/* Distribución de gastos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distribución de Gastos</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div>Vivienda: 40%</div>
              <div>Alimentación: 20%</div>
              <div>Transporte: 15%</div>
              <div>Otros: 25%</div>
            </div>
          </CardContent>
        </Card>

        {/* Metas de ahorro */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas de Ahorro</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Vacaciones: $5,000 / $10,000</div>
            <Progress value={50} className="mt-2" />
          </CardContent>
        </Card>

        {/* Deudas y préstamos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deudas y Préstamos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div>Hipoteca: $150,000</div>
              <div>Préstamo Auto: $15,000</div>
            </div>
          </CardContent>
        </Card>

        {/* Inversiones */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inversiones</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$50,000</div>
            <p className="text-xs text-muted-foreground">+5.2% de rendimiento anual</p>
          </CardContent>
        </Card>

        {/* Flujo de efectivo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimos Movimientos</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div>Supermercado: -$120</div>
              <div>Salario: +$2,500</div>
              <div>Restaurante: -$45</div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas financieras */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Financieras</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-red-500">
              Gasto en entretenimiento excede el presupuesto
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}