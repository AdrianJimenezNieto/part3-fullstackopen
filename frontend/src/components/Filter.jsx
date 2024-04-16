const Filter = ({ filter, handler}) =>
  <div>
    Filter shown with <input value={filter} onChange={handler} />
  </div>

export default Filter