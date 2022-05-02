import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useSystemComponent } from 'swagger-adjust';

const themeInstance = createTheme();

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
