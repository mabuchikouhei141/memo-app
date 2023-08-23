import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";

export default class App {
  constructor(root) {
    this.notes = [];
    this.activeNote = null;
    this.view = new NotesView(root, this._handlers());

    //最初に必ず呼ばれる
    this._refreshNotes();
  }

  _refreshNotes() {
    const notes = NotesAPI.getAllNotes();
    console.log(notes);

    this._setNotes(notes);

    //メモがあるときだけアクティブにする
    if (notes.length > 0) {
      console.log(notes.length);
      this._setActiveNote(notes[0]);
    }
  }

  //セッター
  _setNotes(notes) {
    this.notes = notes;
    this.view.updateNoteList(notes);
  }

  //その指定したメモをアクティブ状態にする。
  _setActiveNote(note) {
    this.activeNote = note;
    this.view.updateActiveNote(note);
    // this.view.updateNotePreviewVisibility(notes.length > 0);
  }

  _handlers() {
    return {
      onNoteSelect: (noteId) => {
        console.log(noteId + "のノートが選択されました");
        const selectedNote = this.notes.find((note) => note.id == noteId);
        this._setActiveNote(selectedNote);
      },
      onNoteAdd: () => {
        console.log("ノートが追加されました");
        const newNote = {
          title: "新しいノート",
          body: "ここに本文を追加",
        };

        NotesAPI.saveNote(newNote);
        this._refreshNotes();
      },
      onNoteEdit: (title, body) => {
        NotesAPI.saveNote({
          id: this.activeNote.id,
          title: title,
          body: body,
        });

        this._refreshNotes();
      },
      onNoteDelete: (noteId) => {
        console.log(noteId + "のノートが削除されました");
        NotesAPI.deleteNote(noteId);
        this._refreshNotes();
      },
    };
  }
}
