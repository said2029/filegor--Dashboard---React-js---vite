import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Chart_Card } from "./components/charts/Chart_Card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./components/ui/chart";
import { Link } from "react-router-dom";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import ApplicationCard from "./components/Cards/ApplicationCard";
import ApplicationList from "./components/ApplicationList";
import useDash from "./hooks/useDash";
import useApplication from "./hooks/useApplication";

function Home() {
  const { totalApp, downloads, totalGames, weekly_Downloads } = useDash();
  const { Applications } = useApplication(true);
  return (
    <main className="pl-60 pr-10 pt-10">
      <div>
        <h1 className="text-xl font-semibold text-black">Dashboard</h1>
        <p className="opacity-60">
          {
            "Welcome to your dashboard. Here you can find \nan overview of your application's performance."
          }
        </p>
      </div>

      <section className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* card */}
        <div className="rounded-xl bg-white shadow-[1px_2px_2px_#00000023]">
          <div className="px-3">
            <p className="text-base font-semibold text-black/60">
              Total Application
            </p>
            <strong className="text-2xl font-bold text-black">
              {totalApp?.count}
            </strong>
          </div>
          <div className="h-36 w-full">
            <Chart_Card
              key={"gderewsdf"}
              chartData={totalApp?.chart ?? []}
              color="hsl(var(--chart-1))"
            />
          </div>
        </div>
        <div className="rounded-xl bg-white shadow-[1px_2px_2px_#00000023]">
          <div className="px-3">
            <p className="text-base font-semibold text-black/60">
              Total Downloads
            </p>
            <strong className="text-2xl font-bold text-black">
              {downloads?.count}
            </strong>
          </div>
          <div className="h-36 w-full">
            <Chart_Card
              key={"gderewdsfdsfdf"}
              chartData={downloads?.chart ?? []}
              color="hsl(var(--chart-2))"
            />
          </div>
        </div>
        <div className="rounded-xl bg-white shadow-[1px_2px_2px_#00000023]">
          <div className="px-3">
            <p className="text-base font-semibold text-black/60">Total Games</p>
            <strong className="text-2xl font-bold text-black">
              {totalGames?.count}
            </strong>
          </div>
          <div className="h-36 w-full">
            <Chart_Card chartData={totalGames?.chart ?? []} color="#9523ff" />
          </div>
        </div>
      </section>

      <section className="mt-11 grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg p-2 shadow-[1px_2px_2px_#00000023] lg:col-span-2">
          <h2 className="text-base font-semibold text-black">Downloads</h2>
          <div className="mt-3 flex items-center gap-5">
            <div className="flex items-center gap-1">
              <span className="block size-2 bg-[hsl(var(--chart-1))]" />
              <strong className="text-sm font-normal opacity-70">
                Application
              </strong>
            </div>
            <div className="flex items-center gap-1">
              <span className="block size-2 bg-[hsl(var(--chart-2))]" />
              <strong className="text-sm font-normal opacity-70">Games</strong>
            </div>
          </div>

          <div className="h-80">
            <Chart_Application chartData2={weekly_Downloads ?? []} />
          </div>
        </div>
        <div className="rounded-lg bg-white shadow-lg lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-black">
              Top Application
            </h2>
            <Link to={"/applications"}>
              <LuSquareArrowOutUpRight className="opacity-65" size={20} />
            </Link>
          </div>
          <div className="mt-5 flex h-full max-h-[350px] flex-col gap-3 overflow-y-auto py-3 px-3">
            {Applications.map((item) => (
              <ApplicationCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <ApplicationList data={Applications} />

      <div className="mt-6 h-3 bg-black"></div>
    </main>
  );
}

const chartConfig = {
  application: {
    label: "application",
    color: "hsl(var(--chart-1))",
  },
  games: {
    label: "Games",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const Chart_Application = ({ chartData2 }: { chartData2: Array<object> }) => {
  return (
    <ChartContainer className="h-full w-full" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        barGap={1}
        barSize={12}
        barCategoryGap={2}
        data={chartData2}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillgames" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-games)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-games)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillapplication" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-application)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-application)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="application"
          type="bump"
          fill="url(#fillapplication)"
          fillOpacity={0.4}
          stroke="var(--color-application)"
          stackId="a"
        />
        <Area
          dataKey="games"
          type="bump"
          fill="url(#fillgames)"
          fillOpacity={0.4}
          stroke="var(--color-games)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default Home;
