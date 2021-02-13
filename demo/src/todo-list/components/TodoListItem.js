import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const TodoListItem = ({ item }) => (
  <ListItem>
    <ListItemText>{item.title}</ListItemText>
  </ListItem>
);

export default TodoListItem;
