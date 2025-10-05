// npm install react-sparklines



import { Sparklines, SparklinesLine } from "react-sparklines";
import "../styles/MiniChart.css";




export default function MiniChart({ data }) {
    if (!data || data.length === 0) return null;

    const first = data[0];
    const last = data[data.length - 1];
    const trendClass = last >= first ? "green" : "red";

    return (
        <div className={`sparkline ${trendClass}`}>
            <Sparklines data={data} margin={5}>
                <SparklinesLine color="currentColor" />
            </Sparklines>
        </div>
    );
}