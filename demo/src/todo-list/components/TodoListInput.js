import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import { useSystemActionCreatorBound } from 'swagger-adjust';

const useStyles = makeStyles(() => ({
  input: {
    borderRadius: 0,
  },
}));

const TodoListInput = () => {
  const [value, setValue] = useState('');
  const classes = useStyles();
  const addItem = useSystemActionCreatorBound('todoList', 'addItem');

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      event.preventDefault();
      addItem({ title: event.target.value });
      setValue('');
    }
  };

  const handleValueChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <TextField
      id="todolist-add"
      fullWidth
      variant="outlined"
      placeholder="Type here and press enter to create new item"
      value={value}
      onChange={handleValueChange}
      InputProps={{
        classes: {
          root: classes.input,
        },
      }}
      onKeyPress={handleKeyPress}
    />
  );
};

export default TodoListInput;
