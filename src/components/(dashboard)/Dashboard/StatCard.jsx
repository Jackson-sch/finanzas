import { currencyFormatter } from "@/components/CurrencyFormatter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function StatCard({
  title,
  amount,
  change,
  icon: Icon,
  changeIcon: ChangeIcon,
  changeColor,
}) {
  return (
    <Card className="bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          {currencyFormatter.format(amount)}
        </div>
        <p className={`flex items-center text-xs ${changeColor}`}>
          <ChangeIcon className="mr-1 h-4 w-4" />
          {change.toFixed(2)}% del mes pasado
        </p>
      </CardContent>
    </Card>
  );
}
