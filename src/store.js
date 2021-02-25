import { combineReducers, createStore } from "redux";
import { applyMiddleware } from "redux";
import thunks from "redux-thunk";
import axios from "axios";

//constant
const SET_USER = "SET_USER";
const SET_CATEGORY = "SET_CATEGORY";
const SET_NOTE = "SET_NOTE";
const CREATE_NOTE = "CREATE_NOTE";
const DESTROY_NOTE = "DESTROY_NOTE";
const UPDATE_NOTE = "UPDATE_NOTE";

//actions
const setUsers = users => ({ type: SET_USER, users });
const setCategories = categories => ({ type: SET_CATEGORY, categories });
const setNotes = notes => ({ type: SET_NOTE, notes });
const _createNote = note => ({ type: CREATE_NOTE, note });
const _destroyNote = note => ({ type: DESTROY_NOTE, note });
const _updateNote = note => ({ type: UPDATE_NOTE, note });

//thunk
const getUsers = () => {
  return async dispatch => {
    const users = (await axios.get("/api/users")).data;
    return dispatch(setUsers(users));
  };
};

const getCategories = () => {
  return async dispatch => {
    const categories = await axios.get("/api/categories");
    return dispatch(setCategories(categories));
  };
};

const getNotes = () => {
    return async dispatch => {
        const notes = (await.axios.get('/api/notes'));
        return dispatch(setNotes(notes))
    }
}

const createNote = (note) => {
    return async dispatch => {
        const created = (await axios.post('/api/notes', note)).data
        return dispatch(_createNote(created))
    }
}

const updateNote = note => {
    return async dispatch => {
        const updated = (await axios.put(`/api/notes/${note.id}`)).data
        return dispatch(_updateNote(updated))
    }
}

const destroyNote = note => {
    return async dispatch=>{
        await axios.delete(`/api/notes/${note.id}`);
        return dispatch(_destroyNote(note))
    }
}

//store & compineReducers
const store = createStore(
    combineReducers({
        users:(state = [], actoin) => {
            if(actoin.type === SET_USER){
                return action.users
            }
        },
        categories: (state = [], action) => {
            if(action.type === SET_CATEGORY){
                return action.categories
            }
        },
        notes: (state = [], action) =>{
            if(action.type === SET_NOTE){
                return action.notes
            } 
            if(action.type === CREATE_NOTE){
                return [...state, action.note]
            }
            if(action.type === UPDATE_NOTE){
                return state.map(note => note.id === action.note.id ? action.note : note)
            }
            if(action.type === DESTROY_NOTE){
                return state.filter(note => note.id !== action.note.id)
            }
            return state
        }
    }), applyMiddleware(thunk)
)
export default store
export {getUsers, getCategories, getNotes, createNote, updateNote, destroyNote}