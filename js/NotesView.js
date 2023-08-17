export default class NotesView {
  constructor(
    root,
    { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}
  ) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `
    <!-- サイドバー -->
    <div class="notesSidebar">
      <button class="notesAdd" type="button">ノートを追加する</button>
      <div class="notesList">
       
      </div>
    </div>
    <!-- ノートプレビュー -->
    <div class="notesPreview">
      <input type="text" class="notesTitle" placeholder="タイトルを記入" />
      <textarea class="notesBody" placeholder="ここに本文を追加"></textarea>
    </div>
    `;

    const btnAddNote = this.root.querySelector(".notesAdd");
    const inputTitle = this.root.querySelector(".notesTitle");
    const inputBody = this.root.querySelector(".notesBody");

    btnAddNote.addEventListener("click", () => {
      this.onNoteAdd();
    });

    [inputTitle, inputBody].forEach((inputField) => {
      inputField.addEventListener("blur", () => {
        const updateTitle = inputTitle.value.trim();
        const updateBody = inputBody.value.trim();

        this.onNoteEdit(updateTitle, updateBody);
      });
    });

    // console.log(
    //   this._createListItemHTML(300, "こんにちは", "挨拶をしました", new Date())
    // );

    //Todo : デフォルトではノートプレビューを隠す。
    // this.updateNotePreviewVisibility(false);
  }

  _createListItemHTML(id, title, body, updated) {
    const MAX_BODY_LENGTH = 60;

    return `
      <div class="notesList-item" data-note-id=${id}>
        <div class="notesSmall-title">${title}</div>
        <div class="notesSmall-body">
          ${body.substring(0, MAX_BODY_LENGTH)}
          ${body.length > MAX_BODY_LENGTH ? "..." : ""}
        </div>
        <div class="notesSmall-updated">${updated.toLocaleString(undefined, {
          dataStyle: "full",
          timeStyle: "short",
        })}</div>
      </div>
    `;
  }

  updateNoteList(notes) {
    const notesListContainer = this.root.querySelector(".notesList");

    //空のリスト
    notesListContainer.innerHTML = "";

    for (const note of notes) {
      const html = this._createListItemHTML(
        note.id,
        note.title,
        note.body,
        new Date(note.updated)
      );

      //第二引数で指定するテキストを HTML または XML と
      //してパースし、その結果であるノードを DOM ツリー内の指定された位置（第一引数で指定）に挿入します。これは挿入先の要素を再度パースするものではないため、既存の要素や要素内部の破壊を伴いません。余分なシリアル化のステップを回避できる分、 innerHTML への代入による直接的な操作よりもはるかに高速な動作となります。
      //beforend noteListContainerの、最初の子要素の前に挿入する
      notesListContainer.insertAdjacentHTML("beforeend", html);
    }

    // 選択と削除のイベントをそれぞれのノートリストに追加する
    notesListContainer
      .querySelectorAll(".notesList-item")
      .forEach((noteListItem) => {
        noteListItem.addEventListener("click", () => {
          // console.log(noteListItem.dataset);
          this.onNoteSelect(noteListItem.dataset.noteId);
        });

        noteListItem.addEventListener("dblclick", () => {
          const doDelete = confirm("本当にこのメモを削除していいですか？");

          if (doDelete) {
            this.onNoteDelete(noteListItem.dataset.noteId);
          }
        });
      });
  }

  updateActiveNote(note) {
    //メモ書く欄に表示する
    this.root.querySelector(".notesTitle").value = note.title;
    this.root.querySelector(".notesBody").value = note.body;

    this.root.querySelectorAll(".notesList-item").forEach((noteListItem) => {
      noteListItem.classList.remove("notesList-item--selected");
    });

    console.log(note);

    this.root
      .querySelector(`.notesList-item[data-note-id="${note.id}"]`)
      .classList.add("notesList-item--selected");
  }

  //プレビューを見せるかどうかの処理
  updateNotePreviewVisibility(visible) {
    this.root.querySelector(".notesPreview").style.visibility = visible
      ? "visible"
      : "hidden";
  }
}
