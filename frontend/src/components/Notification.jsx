const Notification = ({ message, type }) => {
  if (message === null){
    return null
  }

  return (
    <div className={type ? "notification success" : "notification error"}>
      {message}
    </div>
  )
}

export default Notification