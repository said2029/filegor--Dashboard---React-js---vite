import { useEffect, useState } from "react";
import { DashController } from "../utils/actions";
import { useCookies } from "react-cookie";
type totalAppType = {
  count: number;
  chart: Array<{ day: string; application: number }>;
};
type totalDownloadsType = {
  count: number;
  chart: Array<{ day: string; downloads: number }>;
};
type totalGamesType = {
  count: number;
  chart: Array<{ day: string; games: number }>;
};
type weekly_downloadsType = Array<{ day: string; application: number; games: number }>
export default function useDash() {
  const Cookies = useCookies(["authorization"]);

  const [totalApp, setTotalApp] = useState<totalAppType>();
  const [downloads, setDownloads] = useState<totalDownloadsType>();
  const [totalGames, setTotalGames] = useState<totalGamesType>();
  const [weekly_Downloads, setWeekly_Downloads] =
    useState<weekly_downloadsType>();

  const dashProvider = new DashController(Cookies[0].authorization);

  useEffect(() => {
    dashProvider.totalApplication().then((res) => {
      setTotalApp(res);
    });
    dashProvider.totalGames().then((res) => {
      setTotalGames(res);
    });
    dashProvider.TotalDownloads().then((res) => {
      setDownloads(res);
    });
    dashProvider.weekly_Downloads().then((res) => {
      setWeekly_Downloads(res);
    });
  }, []);

  return { totalApp, downloads, totalGames, weekly_Downloads };
}
