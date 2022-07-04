import Image from "next/image";

import endLogo from "public/logos/END.png";
import fazeLogo from "public/logos/FAZE.png";
import flcnLogo from "public/logos/FLCN.png";
import furLogo from "public/logos/FUR.png";
import g2Logo from "public/logos/G2.png";
import glaLogo from "public/logos/GLA.png";
import kcLogo from "public/logos/KC.png";
import kcpLogo from "public/logos/KCP.png";
import bdsLogo from "public/logos/BDS.png";
import mstLogo from "public/logos/MST.png";
import ogLogo from "public/logos/OG.png";
import pwrLogo from "public/logos/PWR.png";
import ssgLogo from "public/logos/SSG.png";
import tlLogo from "public/logos/TL.png";
import tsLogo from "public/logos/TS.png";
import v1Logo from "public/logos/V1.png";

import fallbackLogo from "public/logos/fallback.png";

type TeamTag =
  | "BDS"
  | "END"
  | "FAZE"
  | "FLCN"
  | "FUR"
  | "G2"
  | "GLA"
  | "KC"
  | "KCP"
  | "MST"
  | "OG"
  | "PWR"
  | "SSG"
  | "TL"
  | "TS"
  | "V1";

const TeamLogo = ({ team }: { team: string | null }) => {
  const logos = {
    BDS: bdsLogo,
    END: endLogo,
    FAZE: fazeLogo,
    FLCN: flcnLogo,
    FUR: furLogo,
    G2: g2Logo,
    GLA: glaLogo,
    KC: kcLogo,
    KCP: kcpLogo,
    MST: mstLogo,
    OG: ogLogo,
    PWR: pwrLogo,
    SSG: ssgLogo,
    TL: tlLogo,
    TS: tsLogo,
    V1: v1Logo,
  };

  const logo = logos[team as TeamTag] || fallbackLogo;

  return (
    <Image
      alt={team ?? "fallback logo"}
      src={logo}
      layout={"fill"}
      objectFit={"contain"}
      placeholder={"blur"}
    />
  );
};

const tagLookup = (teamTag: TeamTag) => {
  // Convert long name to short name
  switch (teamTag) {
  }
};

export default TeamLogo;
