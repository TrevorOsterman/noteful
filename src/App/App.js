import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoteListNav from "../NoteListNav/NoteListNav";
import NotePageNav from "../NotePageNav/NotePageNav";
import NoteListMain from "../NoteListMain/NoteListMain";
import NotePageMain from "../NotePageMain/NotePageMain";
import ApiContext from "../ApiContext";
import AddFolder from "../AddFolder/AddFolder";
import AddNote from "../AddNote/AddNote";
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

  addNote(note) {
    this.setState({
      notes: [...this.state.notes, note]
    });
  }

  addFolder(folder) {
    this.setState({ folders: [...this.state.folders, folder] });
  }

  handleDeleteNote = noteId => {
    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
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
      </>
    );
  }

  render() {
    const value = {
      notes: this.state.notes,
      folders: this.state.folders,
      deleteNote: this.handleDeleteNote,
      addNote: this.addNote,
      addFolder: this.addFolder
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
