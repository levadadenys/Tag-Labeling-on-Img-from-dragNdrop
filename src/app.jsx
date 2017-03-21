import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';

import './main.css';

// ** main component is AppContainer component and it is in the end of file. **

////////////Store\\\\\\\\\\\\\
//Store contains imgFile src and array of notes objectі. Note Object tamplate: {id : 1, text : 'Viva la Revolution', coordinates: {left: 14, top: 17}}
const initState = {imgSrc : false, notes : []};
function reducer (state, action) {
    switch (action.type) {
        case 'uploadImage' : return {imgSrc: action.data, notes: []};
        case 'addNote' : return {imgSrc: state.imgSrc, notes: state.notes.concat(action.data)};
        default: return state;
    }
}

const store = createStore(reducer, initState);

/////////Functions\\\\\\\\\\\\\\\\

function dragAndDropInit(inputSelector, dragndropSelector) {
// initializes Drag and Drop and Select file on chosen DnD area (element)
//first argument is querySelector of input element; Second argument is querySelector of dragNdrop area element
	let fileselect = document.querySelector(inputSelector);
    let filedrag = document.querySelector(dragndropSelector);

	// file select
	fileselect.addEventListener("change", fileSelectHandler, false);	
	// file drop
    filedrag.addEventListener("dragover", fileDragHover, false);
	filedrag.addEventListener("dragleave", fileDragHover, false);
	filedrag.addEventListener("drop", fileSelectHandler, false);
	filedrag.style.display = "block";	
}
    
function fileDragHover(e) {
//prevents default browser actions on DnD/Input opening file
	e.stopPropagation();
	e.preventDefault();
}

    
function fileSelectHandler(e) {
//Parses selected img to imgSrc and sends it to store
    fileDragHover(e);
	let files = e.target.files || e.dataTransfer.files;
    let file = files[0];

	// process File object

    if (file.type.match(/image.*/)) {
        let reader = new FileReader();

        reader.onload = (e) => {
            // finished reading file data.
            let imgSrc = e.target.result; 
            store.dispatch({
                type: 'uploadImage',
                data: imgSrc
            });
        }

        reader.readAsDataURL(file); // start reading the file data.
    }
}

function deactivateNotes() {
//Simple function that will erase all '.active' classes in .main div
    document.querySelectorAll('.main .active').forEach(i => i.className = i.className.replace('active',''));
}

function noteClickHandler(e) {
//Upon click on note/tag clicked note/tag and it`s tag/note  becomes active,but before that it makes previously active note/tag not active.
    e.persist();
    deactivateNotes();
    let selectedNoteId = e.currentTarget.className.replace('tag','').replace('active','').trim();
    document.querySelectorAll(`.${selectedNoteId}`).forEach(i => i.className += ' active');
}

//////////////////React Components\\\\\\\\\\\\\\\\\\\
class DragAndDropMenuArea extends React.Component {
//Simple and static DnD element from header menu.
    componentDidMount() {
        dragAndDropInit('.drag_and_drop_select_file', '.drag_and_drop_area');
    }
    render () {
        return (
                <div className = 'drag_and_drop_area'>
                    <img src = './img/drag_and_drop_icon.png'/>
                    <span> Drop or </span>
                    <input className = 'drag_and_drop_select_file' type = "file" name = "files[]" id = "file"/>
                    <label className = 'drag_and_drop_browse_text' htmlFor = "file">browse...</label>
                </div>                            
        )
    }
}

class ImageAreaDropOrBrowse extends React.Component {
//Renders DnD area inside of image area (in case we don`t have img yet)
    componentDidMount () {
        dragAndDropInit('.image_area_select_file', '.image_area_drop_or_browse');
    }
    render () {
        return (
            <div className = 'image_area_drop_or_browse'>
                <img src = './img/drag_and_drop_icon.png'/>
                <span> Drop or </span>
                <input className = 'image_area_select_file' type = "file" name = "files[]" id = "file"/>
                <label className = 'image_area_browse_text' htmlFor = "file">browse...</label>
            </div>
        )
    }
}

class ImageArea extends React.Component {
//This component renders img and tags upon img
//By clicking on img it calls addNoteHandler method, that creates new note object and sends it to store.
    addNoteHandler(e){
        e.persist();
        let note = {};
        let left = e.clientX;
        let top = e.clientY;

               
        note.id = store.getState().notes.length;
        note.text = prompt('Input your note please');
        note.coordinates = {left,top}; 
        if(note.text) store.dispatch({type: 'addNote',
                                      data: note
                                    });
    }

    componentWillUpdate() {
    //Every time before component updates this small function deletes .active class from elements.
        deactivateNotes();
    }

    render (){
        return (
        <div className = 'image_area'>
            <img src = {this.props.imgSrc} className = 'selected_image' onClick = {this.addNoteHandler}/>
            {this.props.tagNotes}
            
        </div>
        )
    }
}

class ListOfNotes extends React.Component {
//Renders main list of notes part
    componentWillUpdate(){
    //Every time before component updates this small function deletes .active class from elements.
        deactivateNotes();
    }
   
    render () {
        return (
                <div className = 'list_of_notes_Container'>
                    <ListOfNotesHeader/>
                    <div className = 'list_of_notes_separator'></div>

                    <div className = 'list_of_notes_list'>
                        {this.props.liNotes}
                    </div>
                </div>
        )
    }
}

class ListOfNotesHeader extends React.Component {
//Just a dummy list of notes header component
    render () {
        return (
            <div className = 'list_of_notes_header'>
                    <div className = 'list_of_notes_header_checkbox latest'></div>
                    <div className = 'list_of_notes_header_checkbox_checked'></div>
                    <div className = 'list_of_notes_header_text latest'>Latest</div>
                    <div className = 'list_of_notes_header_checkbox all'></div>    
                    <div className = 'list_of_notes_header_text all'>All</div>
            </div>
        )
    }
}

class AppContainer extends React.Component {
//Main App component. Responsible for main logic.
//Checks whether we have img or not, if not => it renders DnD area (because we don`t have any img on the start)
                                    //if yes => renders img and list of notes
//After uploading image, renders it and a list of notes to main div.
//Than you can add new tags by clicking on img and input note text. Everytime new note is added app deactivates all notes 
//and then makes last tag active.

    componentDidMount() {
        store.subscribe(()=> this.forceUpdate());
    }

    parseNotesToHTML() {
    //parses every note into <li>(note) and <span>(tag) elements and rerurn them (into render),
    // after rendering there comes setTimeout and marks lastNote as active.
        let storeNotes = store.getState().notes;
        if (!!storeNotes.length) {
            let liNotes = storeNotes.map((i) => <li className = {`note${i.id}`} onClick = {noteClickHandler} key = {i.id}>{i.text}</li>);
            let tagNotes = storeNotes.map((i) =><span className = {`note${i.id} tag`} onClick = {noteClickHandler} key = {i.id} style = {{position: 'absolute',
                                                                                                            left: `${i.coordinates.left - 72}px`,
                                                                                                            top: `${i.coordinates.top -104}px`}}></span>);
            
            let lastNote = liNotes[liNotes.length-1].props.className;
            setTimeout(
                () => {
                    document.querySelector(`.list_of_notes_list .${lastNote}`).className += ' active';
                    document.querySelector(`.image_area .${lastNote}`).className += ' active';
                },0);
            return {liNotes,tagNotes}
        }
        return false;
    }
    render (){
        if (!store.getState().imgSrc) {
            return (
                <div className = 'image_area DnD'>
                    <ImageAreaDropOrBrowse />
                </div>
            )
        }

        let notes = this.parseNotesToHTML();
        let imgSrc = store.getState().imgSrc;

        return (
            <div className = 'app_Container'>
                <ImageArea imgSrc = {imgSrc} tagNotes = {notes.tagNotes}/>
                <ListOfNotes liNotes = {notes.liNotes}/>
            </div>
        )
    }
}

ReactDOM.render(<DragAndDropMenuArea />, document.querySelector('.drag_and_drop_Container'));
ReactDOM.render(<AppContainer />, document.querySelector('.main'));