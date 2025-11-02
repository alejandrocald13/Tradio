import '../styles/ActionPortfolio.css'


// Card with svg

/* data = {
    svg: svg
    name: name
    description: description
    more info :)
}*/
export default function ActionPortfolio({data, children}){
    return(
        <>
            <div className="main-container-AP">
                <div className="svg-container-AP">
                    {data.svg || <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1v16H0V0zm1 15h15v1H1v-1z"></path><path fillRule="evenodd" d="M14.39 4.312L10.041 9.75 7 6.707l-3.646 3.647-.708-.708L7 5.293 9.959 8.25l3.65-4.563.781.624z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M10 3.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v4a.5.5 0 01-1 0V4h-3.5a.5.5 0 01-.5-.5z" clip-rule="evenodd"></path></svg>}
                </div>
                <div className="container-info1-AP">
                    
                    <h1>{data.name || data.stock_name}</h1>
                    <p>{ data.description || data.stock_symbol}</p>
                </div>
                <div className="container-info2-AP">
                    {data.is_active &&(<p>{`Active: ${data.is_active}`}</p>)}
                    {children}
                </div>
            </div>
        </>
    )
}