"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  PieChart,
  ResponsiveContainer,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Clock, ChartPie } from "lucide-react";
import { formatDuration, intervalToDuration } from "date-fns";
import { es } from "date-fns/locale";
import { ReadingTime } from "@/types/stats";

interface ChartData {
  name: string;
  value: number;
  pageStats: { page: number; time: number }[];
}

interface PageTimeData {
  name: string;
  tiempo: number;
}

const colors = [
  "#007AFF",
  "#FF3B30",
  "#34C759",
  "#5856D6",
  "#FF9500",
  "#00C7BE",
  "#FF2D55",
  "#AF52DE",
  "#FF6482",
  "#32ADE6",
] as const;

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#007AFF",
  },
  mobile: {
    label: "Mobile",
    color: "#5856D6",
  },
} as const;

const formatStats = (stats: readonly ReadingTime[]): ChartData[] =>
  stats
    .toSorted((a, b) => b.timeSpent - a.timeSpent)
    .map((stat) => ({
      name: stat.title,
      value: Math.floor(stat.timeSpent / 1000),
      pageStats: stat.pageStats,
    }));

interface ReadingStatsProps {
  readingStats: readonly ReadingTime[];
}

export const ReadingStats = ({ readingStats }: ReadingStatsProps) => {
  const [selectedBook, setSelectedBook] = useState<ReadingTime | null>(null);
  const [selectedBookColor, setSelectedBookColor] = useState<string>(colors[0]);
  const formattedStats = formatStats(readingStats);
  const totalTime = formattedStats.reduce((acc, curr) => acc + curr.value, 0);
  const milliseconds = totalTime * 1000;
  const duration = intervalToDuration({ start: 0, end: milliseconds });

  const pageTimeData: PageTimeData[] =
    selectedBook?.pageStats.map((stat) => ({
      name: `Página ${stat.page + 1}`,
      tiempo: Math.floor(stat.time / 1000),
    })) ?? [];

  return (
    <Card className="mb-6 p-4 shadow-sm rounded-2xl bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Estadísticas de Lectura</h2>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="font-medium">
            Tiempo total: {formatDuration(duration, { locale: es })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={formattedStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  onClick={(data, index) => {
                    setSelectedBook(
                      readingStats.find((stat) => stat.title === data.name) ??
                        null,
                    );
                    setSelectedBookColor(colors[index % colors.length]);
                  }}
                >
                  {formattedStats.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name) => {
                    const duration = intervalToDuration({
                      start: 0,
                      end: value * 1000,
                    });
                    return [formatDuration(duration, { locale: es }), name];
                  }}
                  contentStyle={{
                    background: "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>

        <div className="h-[300px] flex flex-col">
          {selectedBook ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pageTimeData}>
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => `${Math.floor(value / 60)}m`}
                  label={{
                    value: "Tiempo (minutos)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) => {
                    const duration = intervalToDuration({
                      start: 0,
                      end: value * 1000,
                    });
                    return [
                      formatDuration(duration, { locale: es }),
                      "Tiempo de lectura",
                    ];
                  }}
                />
                <Bar dataKey="tiempo" fill={selectedBookColor} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 p-4">
              <ChartPie className="w-12 h-12 text-gray-400" />
              <p className="text-center">
                Haz clic en alguna sección de la gráfica circular para ver
                estadísticas detalladas del tiempo de lectura por página
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
