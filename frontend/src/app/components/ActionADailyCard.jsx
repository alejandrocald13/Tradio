import '../styles/ActionADailyCard.css'



export default function ActionADailyCard({title, children }) {
    return (
        <>
            <div className="action-card-aDaily">
                <div className='title-action-card-aDaily'>
                    <h3>{title}</h3>
                </div>
                <div className='children-action-card-aDaily'>
                    {children}
                </div>
            </div>
        </>
    )
}
