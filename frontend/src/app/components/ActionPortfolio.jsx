import '../styles/ActionPortfolio.css'

export default function CardActionPortafolio({data}){
    return(
        <>
            <div className="main-container-cap">
                <h1>{data.name}</h1>
                <p>{data.description}</p>
                <p>Potafolio: {data.percentage}%</p>
                <p>Rendimiento: {data.rendimiento}%</p>
            </div>
        </>
    )
}