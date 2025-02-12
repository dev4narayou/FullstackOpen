const NoteForm = (props) => {
  const { addNote, newNote, handleNoteChange } = props;
  return (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
  );
};

export default NoteForm;