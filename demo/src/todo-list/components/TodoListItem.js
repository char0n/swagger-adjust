import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const TodoListItem = ({ item }) => (
  <ListItem>
    <ListItemText>{item.title}</ListItemText>
  </ListItem>
);

export default TodoListItem;
