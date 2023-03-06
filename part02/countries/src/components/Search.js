const Search = ({ onChange }) => {
  return (
    <div>
      <span>find countries </span>
      <input onChange={onChange}></input>
    </div>
  )
}

export default Search