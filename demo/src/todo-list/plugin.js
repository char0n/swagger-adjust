import TodoListLayout from './components/TodoListLayout';
import TodoListAppBar from './components/TodoListAppBar';
import TodoListInput from './components/TodoListInput';
import TodoList from './components/TodoList';
import TodoListItem from './components/TodoListItem';
import { addItem } from './actions';
import { selectTodoList, selectTodoListItems } from './selectors';
import reducers, { initialState } from './reducers';

const TodoListPlugin = () => {
  return {
    components: {
      TodoListLayout,
      TodoListAppBar,
      TodoListInput,
      TodoList,
      TodoListItem,
    },
    fn: {
      todoList: {},
    },
    statePlugins: {
      todoList: {
        initialState,
        actions: { addItem },
        selectors: { selectTodoList, selectTodoListItems },
        reducers,
      },
    },
  };
};

export default TodoListPlugin;
