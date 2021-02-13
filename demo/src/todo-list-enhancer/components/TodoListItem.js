import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

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
