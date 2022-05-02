import React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { makeStyles } from '@mui/styles';
import { useSystemComponent, useSystemSelector } from 'swagger-adjust';

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const TodoList = () => {
  const classes = useStyles();
  const items = useSystemSelector('todoList', 'selectTodoListItems');
  const TodoListItem = useSystemComponent('TodoListItem');

  return (
    <List className={classes.root}>
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <TodoListItem item={item} />
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

export default TodoList;
