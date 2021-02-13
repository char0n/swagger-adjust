import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useSystemActionCreator } from 'swagger-adjust';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles(() => ({
  input: {
    borderRadius: 0,
  },
}));

const TodoListInput = () => {
  const [value, setValue] = useState('');
  const classes = useStyles();
  const addItem = useSystemActionCreator('todoList', 'addItem');
  const dispatch = useDispatch();

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      event.preventDefault();
      dispatch(addItem(event.target.value));
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
