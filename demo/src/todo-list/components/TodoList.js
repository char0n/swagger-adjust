import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
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
