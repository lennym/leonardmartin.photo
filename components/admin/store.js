import { createStore, combineReducers } from 'redux'

const uploads = (state = {}, action = {}) => {
  const file = action.file
  switch (action.type) {
    case 'ADD_FILE':
      return {
        ...state,
        [file.path]: {
          ...file,
          started: false,
          completed: false
        }
      }
    case 'START_FILE':
      return {
        ...state,
        [file.path]: {
          ...state[file.path],
          started: true
        }
      }
    case 'FINISH_FILE':
      return {
        ...state,
        [file.path]: {
          ...state[file.path],
          skipped: file.skipped,
          completed: true
        }
      }
    case 'FAILED_FILE':
      return {
        ...state,
        [file.path]: {
          ...state[file.path],
          failed: true
        }
      }
    default:
      return state
  }
}

export default createStore(combineReducers({ uploads }), {})
