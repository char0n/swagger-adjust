import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { useSystemFn, useSystemActionCreatorBound } from 'swagger-adjust';

const TodoListItem = ({ item }) => {
  const formatTimestamp = useSystemFn(['todoList', 'formatTimestamp']);
  const completeItem = useSystemActionCreatorBound('todoList', 'completeItem');
  const uncompleteItem = useSystemActionCreatorBound('todoList', 'uncompleteItem');
  const deleteItem = useSystemActionCreatorBound('todoList', 'deleteItem');

  const handleItemCompletion = (event) => {
    if (event.target.checked) {
      completeItem({ id: item.id });
    } else {
      uncompleteItem({ id: item.id });
    }
  };

  const handleItemDeletion = () => {
    deleteItem({ id: item.id });
  };

  return (
    <ListItem selected={item.completed}>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={item.completed}
          onChange={handleItemCompletion}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': `todoListItem-${item.id}` }}
        />
      </ListItemIcon>
      <ListItemText
        id={`todoListItem-${item.id}`}
        primary={item.title}
        secondary={formatTimestamp(item.createdAt)}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={handleItemDeletion}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default React.memo(TodoListItem);
