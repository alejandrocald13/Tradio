import '../styles/ActionAdminCard.css'



export default function ActionAdminCard({title, children }) {
    return (
        <>
            <div className="action-card-admin">
                <div className='title-action-card-admin'>
                    <h3>{title}</h3>
                </div>
                <div className='children-action-card-admin'>
                    {children}
                </div>
            </div>
        </>
    )
}
