import ActionDetails from "../../components/ActionDetails";
import "./actionSymbol.css";
import { MOCK, TAB_ORDER } from "../../data/mockQuotes";
import SidebarNav from "@/app/components/SidebarNav-Auth";

export default async function ActionDetailPage({ params }) {
  const { symbol } = await params;
  const data_details = MOCK[symbol];
  const name_action = data_details ? data_details.name : "Unknown";

  if (!data_details) {
    return <div className='container'>Sin datos para {symbol}</div>;
  }

  const dataByTab = Object.fromEntries(
    Object.entries(data_details.tabs).map(([time, data_show]) => ([ // time = "1D" data_show = {labels:[], data:[]}
      time,
      {
        data: data_show.data.map(Number),
        labels: data_show.labels.map(String),
        ref: typeof data_show.ref === "number" ? data_show.ref : undefined,
      }
    ]))
  );

  // Se muestran solo las pestañas que tienen datos como "1D", "5D" y lo que hay
  const tabs = TAB_ORDER.filter(timeTab => timeTab in dataByTab);

  const changeAbsolute = data_details.last - data_details.prevClose;
  const changePct = (changeAbsolute / data_details.prevClose) * 100;
  const changePrice = changeAbsolute > 0 ? "up" : changeAbsolute < 0 ? "down" : "neutral";

  return (
    <>
      <SidebarNav />
      <div className='global-container'>
        <div className="container-detail">
          <ActionDetails
            subtitle="Nasdaq GIDS · Delayed Quote"
            title={`${name_action}`}
            price={`$${data_details.last.toFixed(2)}`}
            change={`${changeAbsolute >= 0 ? "+" : ""}${changeAbsolute.toFixed(2)} (${changePct.toFixed(2)}%)`}
            changeTone={changePrice}
            tabs={tabs}
            dataByTab={dataByTab}
          />
        </div>
      </div>

    </>
  );
}
