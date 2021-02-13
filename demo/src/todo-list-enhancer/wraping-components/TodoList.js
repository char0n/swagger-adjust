import React from 'react';
import { useSystemComponent } from 'swagger-adjust';

const TodoList = (Original) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const TodoListBatchOperations = useSystemComponent('TodoListBatchOperations');

  return (
    <div>
      <Original {...props} />
      <TodoListBatchOperations />
    </div>
  );
};

export default TodoList;
