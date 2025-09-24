"use client";


import ActionCard from "../components/ActionCard";
import "./actions.css";
import SidebarNav from "../components/SidebarNav-Auth";
import MiniChart from "../components/MiniChart";




export default function Actions() {
    return (
        <>
        <SidebarNav/>
        <div className="page-container">
            <SidebarNav/>
            <div className="action-container">
                <ActionCard
                    actionName="Tesla Inc. (TSLA)"
                    price="$274.56"
                    priceVariant="-5.41"
                    graphic={
                        <MiniChart data={[290, 288, 285, 283, 280, 278, 277, 276, 275, 274]} />
                    }
                />

                <ActionCard
                    actionName="NVIDIA Corp. (NVDA)"
                    price="$1,145.32"
                    priceVariant="+12.24"
                    graphic={
                        <MiniChart data={[1120, 1125, 1130, 1135, 1140, 1142, 1145, 1147, 1143, 1146]} />
                    }
                />

                <ActionCard
                    actionName="Amazon.com Inc. (AMZN)"
                    price="$178.33"
                    priceVariant="+2.11"
                    graphic={
                        <MiniChart data={[172, 174, 175, 176, 177, 179, 181, 180, 179, 178]} />
                    }
                />

                <ActionCard
                    actionName="Meta Platforms (META)"
                    price="$512.40"
                    priceVariant="-4.76"
                    graphic={
                        <MiniChart data={[520, 518, 516, 514, 512, 510, 509, 508, 507, 512]} />
                    }
                />

                <ActionCard
                    actionName="Microsoft Corp. (MSFT)"
                    price="$420.15"
                    priceVariant="-2.14"
                    graphic={
                        <MiniChart data={[428, 426, 424, 423, 422, 421, 420, 421, 420, 419]} />
                    }
                />

                <ActionCard
                    actionName="Alphabet Inc. (GOOGL)"
                    price="$165.74"
                    priceVariant="-1.02"
                    graphic={
                        <MiniChart data={[167, 166.5, 166, 165.8, 165.6, 165.5, 165.7, 165.9, 165.8, 165.7]} />
                    }
                />

                <ActionCard
                    actionName="Netflix Inc. (NFLX)"
                    price="$652.18"
                    priceVariant="-3.54"
                    graphic={
                        <MiniChart data={[660, 659, 657, 655, 654, 653, 652, 651, 652, 652]} />
                    }
                />

                <ActionCard
                    actionName="Ethereum (ETH-USD)"
                    price="$3,412.58"
                    priceVariant="0.00"
                    graphic={
                        <MiniChart data={[3410, 3411, 3412, 3413, 3412, 3411, 3412, 3413, 3412, 3412]} />
                    }
                />

                <ActionCard 
                    actionName="Meta Platforms (META)" 
                    price="$512.40" 
                    priceVariant="-4.76" 
                    graphic={
                        <MiniChart data={[520, 510, 515, 505, 508, 500, 495, 498, 492, 490]} />
                    } 
                />

                <ActionCard 
                    actionName="Microsoft Corp. (MSFT)" 
                    price="$420.15" 
                    priceVariant="-2.14" 
                    graphic={
                        <MiniChart data={[425, 423, 422, 421, 420, 418, 417, 419, 416, 415]} />
                    } 
                />

                <ActionCard 
                    actionName="S&P 500 ETF (SPY)" 
                    price="$545.22" 
                    priceVariant="+3.05" 
                    graphic={
                        <MiniChart data={[540, 542, 543, 544, 545, 546, 544, 547, 545, 546]} />
                    } 
                />

                <ActionCard 
                    actionName="Bitcoin (BTC-USD)" 
                    price="$65,412.87" 
                    priceVariant="-1,230.50" 
                    graphic={
                        <MiniChart data={[66200, 66000, 65800, 65700, 65500, 65400, 65300, 65200, 65100, 65412]} />
                    } 
                />

                <ActionCard 
                    actionName="Alphabet Inc. (GOOGL)" 
                    price="$165.74" 
                    priceVariant="-1.02" 
                    graphic={
                        <MiniChart data={[167, 166, 165, 166, 165.5, 165.2, 165.8, 166, 165.4, 165.7]} />
                    } 
                />

                <ActionCard 
                    actionName="Netflix Inc. (NFLX)" 
                    price="$652.18" 
                    priceVariant="-3.54" 
                    graphic={
                        <MiniChart data={[660, 658, 656, 654, 653, 652, 651, 650, 653, 652]} />
                    } 
                />

                <ActionCard 
                    actionName="Dow Jones Index (DJI)" 
                    price="45,412.25" 
                    priceVariant="-220.43" 
                    graphic={
                        <MiniChart data={[45600, 45550, 45500, 45450, 45400, 45350, 45300, 45250, 45200, 45412]} />
                    } 
                />

                <ActionCard 
                    actionName="Ethereum (ETH-USD)" 
                    price="$3,412.58" 
                    priceVariant="0.00" 
                    graphic={
                        <MiniChart data={[3410, 3412, 3413, 3411, 3412, 3414, 3412, 3411, 3413, 3412]} />
                    } 
                />

            </div>
        </div>
        </>
    );
}
