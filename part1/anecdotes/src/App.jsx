import { useState } from "react";

const DisplayVotes = (props) => {
  return (
    <div>has {props.votes[props.selected]} votes</div>
  )
}

const Button = (props) => {
  return <button onClick={props.onClick}>{props.text}</button>;
};

  const MostVoted = (props) => {
    const [highestVotes, highestVotesIndex] = props.votes.reduce(
      (acc, curr, index) => (curr > acc[0] ? (acc = [curr, index]) : acc),
      [0, 0]
    );
    return (
      <>
        <div>{props.anecdotes[highestVotesIndex]}</div>
        <div>has {highestVotes} votes</div>
      </>
    );
  };

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));
  const [selected, setSelected] = useState(0);

  const handleNextAnecdoteClick = () => {
    return () => {
      const nextIndex = Math.floor(Math.random() * anecdotes.length)
      setSelected(nextIndex)
    }
  }
  const handleVoteClick = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <DisplayVotes votes={votes} selected={selected} />
      <Button onClick={handleVoteClick} text="vote" />
      <Button onClick={handleNextAnecdoteClick()} text="next anecdote" />

      <h1>Anecdote with the most votes</h1>
      <MostVoted votes={votes} anecdotes={anecdotes} />
    </div>
  );
};

export default App;
