
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { CardDescription } from '../ui/card';

const chartData = [
  { day: 'Mon', meetings: 2, messages: 30 },
  { day: 'Tue', meetings: 1, messages: 45 },
  { day: 'Wed', meetings: 3, messages: 60 },
  { day: 'Thu', meetings: 2, messages: 25 },
  { day: 'Fri', meetings: 4, messages: 70 },
  { day: 'Sat', meetings: 0, messages: 10 },
  { day: 'Sun', meetings: 1, messages: 15 },
];

const chartConfig = {
  meetings: {
    label: 'Meetings Joined',
    color: 'hsl(var(--chart-1))',
  },
  messages: {
    label: 'Messages Sent',
    color: 'hsl(var(--chart-2))',
  },
  empty: { // For placeholder if no data
    label: 'No Activity',
    color: 'hsl(var(--muted))',
  }
} satisfies ChartConfig;

export function ActivityChart() {
  // Handle case with no data or all zero data to show a message
  const hasActivity = chartData.some(d => d.meetings > 0 || d.messages > 0);

  if (!hasActivity) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground opacity-50 mb-3">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
          <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
        <p className="text-sm font-medium text-foreground">No Activity Yet</p>
        <CardDescription className="text-xs mt-1">
          Your engagement metrics will appear here once you start using the platform.
        </CardDescription>
      </div>
    );
  }


  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full text-xs">
      <BarChart 
        accessibilityLayer 
        data={chartData} 
        margin={{ top: 25, right: 10, left: -20, bottom: 5 }}
        barGap={4} // Space between bars of the same group
        barCategoryGap="20%" // Space between groups of bars
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="fill-muted-foreground"
        />
        <YAxis 
            tickLine={false} 
            axisLine={false} 
            tickMargin={8} 
            className="fill-muted-foreground"
            width={30} // Ensure enough space for Y-axis labels
        />
        <ChartTooltip
          cursor={true}
          wrapperClassName="rounded-lg shadow-lg"
          content={<ChartTooltipContent 
            indicator="dot" 
            className="bg-popover text-popover-foreground border-border/70 shadow-xl rounded-md text-[11px]" 
            labelClassName="font-semibold"
            hideLabel={false}
            />}
        />
        <ChartLegend 
            content={<ChartLegendContent className="text-[11px] [&>div]:gap-1 [&_svg]:size-2.5"/>} 
            wrapperStyle={{ paddingTop: '20px' }} 
            verticalAlign="top" 
            align="right"
            
        />
        <Bar dataKey="meetings" fill="var(--color-meetings)" radius={[4, 4, 0, 0]} maxBarSize={30} />
        <Bar dataKey="messages" fill="var(--color-messages)" radius={[4, 4, 0, 0]} maxBarSize={30}/>
      </BarChart>
    </ChartContainer>
  );
}
