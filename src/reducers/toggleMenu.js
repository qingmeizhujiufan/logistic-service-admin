import assign from 'lodash/assign';
import { TOGGLE_MENU, toggle } from '../actions/toggleMenu';
//reducer其实也是个方法而已,参数是state和action,返回值是新的state
export default function toggleMenu(state = {collapsed: false}, action) {
  switch (action.type) {
    case TOGGLE_MENU:
    	console.log('reducer toggleMenu state === ', state);
        return assign({}, state, toggle(!action.collapsed));
    default:
        return assign({}, state);
  }
}