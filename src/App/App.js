import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoteListNav from "../NoteListNav/NoteListNav";
import NotePageNav from "../NotePageNav/NotePageNav";
import NoteListMain from "../NoteListMain/NoteListMain";
import NotePageMain from "../NotePageMain/NotePageMain";
import ApiContext from "../ApiContext";
import AddFolder from "../AddFolder/AddFolder";
import EditFolder from "../EditFolder/EditFolder";
import AddNote from "../AddNote/AddNote";
import EditNote from "../EditNote/EditNote";
import config from "../config";
import "./App.css";
import ErrorBoundary from "../ErrorBoundary";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      folders: []
    };
    this.addNote = this.addNote.bind(this);
    this.addFolder = this.addFolder.bind(this);
    this.editNote = this.editNote.bind(this);
    this.editFolder = this.editFolder.bind(this);
  }

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/notes`),
      fetch(`${config.API_ENDPOINT}/folders`)
    ])
      .then(([notesRes, foldersRes]) => {
        if (!notesRes.ok) return notesRes.json().then(e => Promise.reject(e));
        if (!foldersRes.ok)
          return foldersRes.json().then(e => Promise.reject(e));

        return Promise.all([notesRes.json(), foldersRes.json()]);
      })
      .then(([notes, folders]) => {
        this.setState({ notes, folders });
      })
      .catch(error => {
        console.error({ error });
      });
  }

  // componentDidUpdate() {
  //   Promise.all([
  //     fetch(`${config.API_ENDPOINT}/notes`),
  //     fetch(`${config.API_ENDPOINT}/folders`)
  //   ])
  //     .then(([notesRes, foldersRes]) => {
  //       if (!notesRes.ok) return notesRes.json().then(e => Promise.reject(e));
  //       if (!foldersRes.ok)
  //         return foldersRes.json().then(e => Promise.reject(e));
  //
  //       return Promise.all([notesRes.json(), foldersRes.json()]);
  //     })
  //     .then(([notes, folders]) => {
  //       console.log(notes);
  //       console.log(folders);
  //     })
  //     .catch(error => {
  //       console.error({ error });
  //     });
  // }

  addNote(note) {
    this.setState({
      notes: [...this.state.notes, note]
    });
  }

  editNote(note, id) {
    console.log(note);
    this.setState({
      notes: [...this.state.notes.filter(oldNote => oldNote.id !== id), note]
    });
  }

  addFolder(folder) {
    this.setState({ folders: [...this.state.folders, folder] });
  }

  editFolder(folder, id) {
    this.setState({
      folders: [
        ...this.state.folders.filter(oldFold => oldFold.id !== id),
        folder
      ]
    });
  }

  handleDeleteNote = noteId => {
    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
    });
  };

  handleDeleteFolder = folderId => {
    this.setState({
      folders: this.state.folders.filter(folder => folder.id !== folderId)
    });
  };

  renderNavRoutes() {
    return (
      <>
        {["/", "/folder/:folderId"].map(path => (
          <Route exact key={path} path={path} component={NoteListNav} />
        ))}
        <Route path="/note/:noteId" component={NotePageNav} />
        <Route path="/add-folder" component={NotePageNav} />
        <Route path="/add-note" component={NotePageNav} />
        <Route path="/edit-note/:noteId" component={NotePageNav} />
        <Route path="/edit-folder/:folderId" component={NotePageNav} />
      </>
    );
  }

  renderMainRoutes() {
    return (
      <>
        {["/", "/folder/:folderId"].map(path => (
          <Route exact key={path} path={path} component={NoteListMain} />
        ))}
        <Route path="/note/:noteId" component={NotePageMain} />
        <Route path="/add-folder" component={AddFolder} />
        <Route path="/add-note" component={AddNote} />
        <Route path="/edit-note/:noteId" component={EditNote} />
        <Route path="/edit-folder/:folderId" component={EditFolder} />
      </>
    );
  }

  render() {
    const value = {
      notes: this.state.notes,
      folders: this.state.folders,
      deleteNote: this.handleDeleteNote,
      deleteFolder: this.handleDeleteFolder,
      addNote: this.addNote,
      addFolder: this.addFolder,
      editNote: this.editNote,
      editFolder: this.editFolder
    };
    return (
      <ApiContext.Provider value={value}>
        <div className="App">
          <ErrorBoundary>
            <nav className="App__nav">{this.renderNavRoutes()}</nav>
          </ErrorBoundary>
          <header className="App__header">
            <h1>
              <Link to="/">Noteful</Link>{" "}
              <FontAwesomeIcon icon="check-double" />
            </h1>
          </header>
          <ErrorBoundary>
            <main className="App__main">{this.renderMainRoutes()}</main>
          </ErrorBoundary>
        </div>
      </ApiContext.Provider>
    );
  }
}

export default App;
