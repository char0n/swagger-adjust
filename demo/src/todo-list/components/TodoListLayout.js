import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme, // eslint-disable-line
} from '@material-ui/core/styles';
import { useSystemComponent } from 'swagger-adjust';

const themeInstance = unstable_createMuiStrictModeTheme();

const TodoListLayout = () => {
  const TodoListAppBar = useSystemComponent('TodoListAppBar');
  const TodoListInput = useSystemComponent('TodoListInput');
  const TodoList = useSystemComponent('TodoList');

  return (
    <ThemeProvider theme={themeInstance}>
      <CssBaseline />
      <TodoListAppBar />
      <Paper component="main">
        <TodoListInput />
        <TodoList />
      </Paper>
    </ThemeProvider>
  );
};

export default TodoListLayout;
