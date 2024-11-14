import { useState } from "react";

const Button = (props) => {
  return <button onClick={props.onClick}>{props.text}</button>;
};

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const DisplayAll = (props) => {
  return (
    <tr>
      <td>all</td>
      <td>{props.counts.reduce((acc, curr) => acc + curr)}</td>
    </tr>
  );
};

const DisplayAverage = (props) => {
  const total = props.counts.reduce((acc, curr) => acc + curr, 0);
  const scores = props.counts.map((elem, index) => elem * props.scores[index]);
  const average = scores.reduce((acc, curr) => acc + curr, 0) / total;
  return (
    <tr>
      <td>average</td>
      <td>{isNaN(average) ? 0 : average.toFixed(2)}</td>
    </tr>
  );
};

const DisplayPositive = (props) => {
  const total = props.counts.reduce((acc, curr) => acc + curr, 0);
  const positive = props.counts[0];
  const positivePercentage = (positive / total) * 100;
  return (
    <tr>
      <td>positive</td>
      <td>{isNaN(positivePercentage) ? 0 : positivePercentage.toFixed(2)} %</td>
    </tr>
  );
};

const Statistics = (props) => {
  const { good, neutral, bad, counts, scores } = props;
  if (counts.reduce((acc, curr) => acc + curr) === 0) {
    return <p>No feedback given</p>;
  } else {
    return (
      <table>
        <tbody>
          <StatisticLine value={good} text="good" />
          <StatisticLine value={neutral} text="neutral" />
          <StatisticLine value={bad} text="bad" />
          <DisplayAll counts={counts} />
          <DisplayAverage counts={counts} scores={scores} />
          <DisplayPositive counts={counts} />
        </tbody>
      </table>
    );
  }
};
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const counts = [good, neutral, bad];
  const scores = [1, 0, -1];

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />

      <h1>statistics</h1>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        counts={counts}
        scores={scores}
      />
    </div>
  );
};

export default App;
