import { createStore } from "redux";
import reducer from "./reducers/noteReducer";
import { createNote, toggleImportanceOf } from "./reducers/noteReducer";
import { useSelector, useDispatch } from "react-redux";
import NewNote from "./components/NewNote";
import Notes from "./components/Notes";


const App = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state);
  const importantNotes = useSelector((state) =>
    state.filter((note) => note.important)
  );

 const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id));
 };

  return (
    <div>
      <NewNote/>
      <Notes/>
    </div>
  );
}

export default App;