import { Area, AreaChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

export function Chart_Card({
  chartData,
  color,
}: {
  chartData: Array<object>;
  color?: string;
}) {
  const Name = () => {
    if (chartData.length <= 1) return "null";
    const toArray = Object.entries(chartData[0]);
    if (toArray) {
      return toArray[1][0];
    }
    return "null";
  };
  const Config = () => {
    return {
      [Name()]: {
        label: Name(),
        color: color,
      },
    };
  };
  return (
    <>
      {chartData && (
        <ChartContainer className="h-full w-full" config={Config()}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            {/* <CartesianGrid vertical={false} /> */}
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id={`fill${Name()}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-${Name()})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${Name()})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey={Name()}
              type="bump"
              fill={`url(#fill${Name()})`}
              fillOpacity={0.4}
              stroke={`var(--color-${Name()})`}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      )}
    </>
  );
}
