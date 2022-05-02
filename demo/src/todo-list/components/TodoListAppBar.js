import React from 'react';
import MUIAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

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
