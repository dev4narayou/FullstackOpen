import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote, createAnecdote } from './reducers/anecdoteReducer'
import './App.css'

const App = () => {
  const anecdotes = useSelector((state) =>
    [...state].sort((a, b) => b.votes - a.votes)
  );
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(voteAnecdote(id))
  }

  const addAnecdote = (event) => {
    event.preventDefault();
    const content = event.target.input.value
    event.target.input.value = ''
    dispatch(createAnecdote(content))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id} className="anecdote">
          <div className="anecdote-content">{anecdote.content}</div>
          <div className="anecdote-votes">
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="input" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
}

export default App