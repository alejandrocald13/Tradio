import "../styles/ActionCard.css";




export default function ActionCard({ actionName, price, priceVariant, graphic }) {
    const numericVariant = parseFloat(priceVariant);
    const variantType= numericVariant > 0 ? "positive" : numericVariant < 0 ? "negative" : "neutral";

    return (
        <div className="action-card">

            <div className="ac-container-up ">
                <div className="ac-title">
                    <span>{actionName}</span>
                </div>
                <div className={`ac-variant ${variantType}`}>
                    <span>{priceVariant}</span>
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

        </div>
    )

}
