import { useState } from 'react'

const FeedbackButton = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const DisplayFeedback = (props) => {
  return (
    <tr>
      <td>{props.text} {props.num}</td>
    </tr>
  )
}

const DisplayAll = (props) => {
  return (
    <tr>
      <td>all {(props.counts).reduce((acc, curr) => acc + curr)}</td>
    </tr>
  )
}

const DisplayAverage = (props) => {
  const total = props.counts.reduce((acc, curr) => acc + curr, 0)
  const scores = props.counts.map((elem, index) => elem * props.scores[index])
  const average = scores.reduce((acc, curr) => acc + curr, 0) / total
  return (
    <tr>
      <td>average {isNaN(average) ? 0 : average}</td>
    </tr>
  )
}

const DisplayPositive = (props) => {
  const total = props.counts.reduce((acc, curr) => acc + curr, 0)
  const positive = props.counts[0]
  const positivePercentage = ((positive / total) * 100).toFixed(2)
  return (
    <tr>
      <td>
        positive {isNaN(positivePercentage) ? 0 : positivePercentage} %
      </td>
    </tr>
  )
}

const FeedbackStatistics = (props) => {
  const {good, neutral, bad, counts, scores} = props
  return (
    <table>
      <tbody>
        <DisplayFeedback num={good} text="good" />
        <DisplayFeedback num={neutral} text="neutral" />
        <DisplayFeedback num={bad} text="bad" />
        <DisplayAll counts={counts} />
        <DisplayAverage counts={counts} scores={scores}/>
        <DisplayPositive counts={counts} />
      </tbody>
    </table>
  )
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const counts = [good, neutral, bad]
  const scores = [1, 0, -1]

  return (
    <div>
      <h1>give feedback</h1>
      <FeedbackButton onClick={() => setGood(good + 1)}  text="good" />
      <FeedbackButton onClick={() => setNeutral(neutral + 1)}  text="neutral" />
      <FeedbackButton onClick={() => setBad(bad + 1)} text="bad" />

      <h1>statistics</h1>
      <FeedbackStatistics
        good={good}
        neutral={neutral}
        bad={bad}
        counts={counts}
        scores={scores} />
    </div>
  )
}

export default App