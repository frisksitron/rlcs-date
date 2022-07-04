import type { Leaderboard, Transfer } from "@prisma/client";
import { load } from "cheerio";
import { toShortName } from "./helpers";

const parseLeaderboardTable = (
  page: string | undefined,
  regionSelector: string,
  regionName: string
): Omit<Leaderboard, "id">[] => {
  if (page === undefined) {
    return [];
  }

  const $ = load(page);

  const qualifiedForChampionshipAttr =
    "font-weight:bold;background-color:rgb(219,237,237)";
  const qualifiedForWildcardAttr =
    "font-weight:bold;background-color:rgb(221,244,221)";

  return $(regionSelector)
    .toArray()
    .slice(1)
    .map((x) => {
      const name =
        $("td:nth-child(2) span", x).attr("data-highlightingclass") || "-";
      const tag = toShortName(name);

      return {
        name: name,
        tag: tag,
        region: regionName,
        points: parseInt($("td:nth-child(3)", x).text() || "0", 10),
        qualifiedForChampionship:
          $(`td:nth-child(1)`, x).attr("style") ===
          qualifiedForChampionshipAttr,
        qualifiedForWildcard:
          $(`td:nth-child(1)`, x).attr("style") === qualifiedForWildcardAttr,
      };
    });
};

export const parseLeaderboardTables = (
  page: string | undefined
): Omit<Leaderboard, "id">[] => {
  const eu = ["EU", ".template-box:nth-child(2) table tr"];
  const na = ["NA", ".template-box:nth-child(3) table tr"];
  const oce = ["OCE", ".template-box:nth-child(4) table tr"];
  const sam = ["SAM", ".template-box:nth-child(5) table tr"];
  const mena = ["MENA", ".template-box:nth-child(6) table tr"];
  const apacN = ["APAC N", ".template-box:nth-child(7) table tr"];
  const apacS = ["APAC S", ".template-box:nth-child(8) table tr"];
  const ssa = ["SSA", ".template-box:nth-child(9) table tr"];

  return [eu, na, oce, sam, mena, apacN, apacS, ssa]
    .map(([name, selector]) => parseLeaderboardTable(page, selector, name))
    .flat();
};

export const parseTransfersTable = (
  page: string | undefined
): Omit<Transfer, "id">[] => {
  if (page === undefined) {
    return [];
  }

  const $ = load(page);

  return $(
    ".mainpage-transfer-from-team,.mainpage-transfer-to-team,.mainpage-transfer-neutral"
  )
    .toArray()
    .map((x) => {
      const timestamp = $(".Date", x).text();
      const date = timestamp ? new Date(timestamp) : null;
      const oldTeamName = $(".OldTeam > a", x).text() ?? null;
      const newTeamName = $(".NewTeam > a", x).text() ?? null;

      return {
        date: date?.toISOString() ?? "",
        players:
          $(".Name > a[title]", x)
            .toArray()
            .map((y) => $(y).text())
            .join(", ") ?? "",
        oldTeamName: oldTeamName,
        oldTeamTag: toShortName(oldTeamName),
        newTeamName: newTeamName,
        newTeamTag: toShortName(newTeamName),
        source: $("div:nth-child(6) > a", x).attr("href") ?? null,
      };
    });
};
