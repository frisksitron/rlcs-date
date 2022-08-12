import { TransfersResponse } from "@/pages/api/transfers";
import { useQuery } from "@tanstack/react-query";

const fetcher = async () => {
  const res = await fetch(`/api/transfers`);
  if (!res.ok) {
    throw Error("Error fetching transfers");
  }
  const data: TransfersResponse = await res.json();
  return data.transfers;
};

const Transfers = () => {
  const { data } = useQuery(["transfers"], fetcher);

  return (
    <div>
      {data?.slice(0, 5).map((transfer) => {
        let transferText = `${transfer.oldTeamName} → ${transfer.newTeamName}`;

        if (!transfer.newTeamName) {
          transferText = `Leaves ${transfer.oldTeamName}`;
        } else if (!transfer.oldTeamName) {
          transferText = `Joins ${transfer.newTeamName}`;
        } else if (!transfer.oldTeamName && !transfer.newTeamName) {
          transferText = ``;
        }

        return (
          <div className={"mb-5"} key={transfer.id}>
            <div className="text-lg font-bold">{transfer.players}</div>
            <div>{transferText}</div>
            {transfer.source && (
              <div className="mb-2">
                <a
                  className="link"
                  href={transfer.source}
                  target={"_blank"}
                  rel="noreferrer"
                >
                  Source (external link)
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Transfers;
