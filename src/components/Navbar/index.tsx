import Image from "next/image";
import Link from "next/link";
import logo from "public/logo.png";

const Index = () => {
  return (
    <div className="navbar bg-neutral text-neutral-content">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-neutral p-2 shadow"
          >
            <li>
              <Link href={"/leaderboard"}>Leaderboard</Link>
            </li>
            <li>
              <a
                href={"https://www.reddit.com/r/RocketLeagueEsports/wiki/guide"}
                target={"_blank"}
                rel="noreferrer"
              >
                Format guide (reddit)
              </a>
            </li>
          </ul>
        </div>
        <Link href={"/"}>
          <a className="btn btn-ghost text-xl normal-case">
            <Image src={logo} alt="rlcs.date logo" height={42} width={42} />
            <div className="ml-2">rlcs.date</div>
          </a>
        </Link>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link href={"/leaderboard"}>Leaderboard</Link>
          </li>
          <li>
            <a
              href={"https://www.reddit.com/r/RocketLeagueEsports/wiki/guide"}
              target={"_blank"}
              rel="noreferrer"
            >
              Format guide (reddit)
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Index;
