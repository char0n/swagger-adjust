import React from 'react';
import MUIAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const TodoListAppBar = () => {
  return (
    <MUIAppBar position="sticky">
      <Toolbar>
        <Typography variant="h6">TodoList</Typography>
      </Toolbar>
    </MUIAppBar>
  );
};

export default TodoListAppBar;
