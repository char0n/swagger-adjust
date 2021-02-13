import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSystemActionCreatorBound } from 'swagger-adjust';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const TodoListBatchOperations = () => {
  const classes = useStyles();
  const completeAll = useSystemActionCreatorBound('todoList', 'completeAll');
  const deleteAll = useSystemActionCreatorBound('todoList', 'deleteAll');

  const handleCompleteAll = () => {
    completeAll();
  };

  const handleDeleteAll = () => {
    deleteAll();
  };

  return (
    <div className={classes.root}>
      <ButtonGroup variant="contained" color="primary" aria-label="batch operations" size="small">
        <Button onClick={handleCompleteAll}>Complete all</Button>
        <Button color="secondary" onClick={handleDeleteAll}>
          Delete all
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default TodoListBatchOperations;
