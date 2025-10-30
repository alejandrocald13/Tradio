"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "../styles/ActionCard.css";




export default function ActionCard({ symbol, actionName, price, changeText, variantClass, graphic, basePath = "/actions", }) {

    
    const pathname = usePathname();

    const adjustedBasePath = pathname.startsWith("/landing/actions")
        ? "/landing/actions"
        : basePath;

    const finalClass = variantClass ;
    const symbolFromName = (name = "") =>
        name.match(/\(([^)]+)\)$/)?.[1] || name.trim(); // "Tesla Inc. (TSLA)" -> "TSLA"

    const sym = symbol || symbolFromName(actionName);

    return (
        <Link href={`${adjustedBasePath}/${sym}`} className="action-card" prefetch>
            {/* <div className="action-card"> */}

            <div className="ac-container-up">
                <div className="ac-title">
                    <span>{actionName}</span>
                </div>
                <div className={`ac-variant ${finalClass}`}>
                    <span className="ac-amount">{changeText}</span>
                </div>
            </div>

            <div className="ac-container-down">
                <div className="ac-price">
                    <span>{price}</span>
                </div>
                <div className="ac-graphic">
                    {graphic}
                </div>
            </div>

            {/* </div> */}
        </Link>
    )

}
