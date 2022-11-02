import React from 'react';
import { FaRegTrashAlt, FaEdit} from 'react-icons/fa';


const style = {
  li: `flex justify-between bg-slate-200 p-4 my-2 capitalize`,
  liComplete: `flex justify-between bg-slate-400 p-4 my-2 capitalize`,
  row: `flex`,
  text: `ml-2 cursor-pointer`,
  textComplete: `ml-2 cursor-pointer line-through`,
  btn: `flex`,
  button: `items-center`,
};

const Todo = ({ todo, toggleComplete, deleteTodo, updateTodo }) => {
  return (
    <li className={todo.completed ? style.liComplete : style.li}>
      <div className={style.row}>
        <input onChange={() => toggleComplete(todo)} type='checkbox' checked={todo.completed ? 'checked' : ''} />
        <p onClick={() => toggleComplete(todo)} className={todo.completed ? style.textComplete : style.text}>
          {todo.text}
        </p>
      </div>
      <div className='style.btn'>
        <button onClick={() => deleteTodo(todo.id)}>{<FaRegTrashAlt />}</button>
        <button onClick={() => updateTodo(todo)}>{<FaEdit />}</button>
      </div>
     
    </li>
  );
};

export default Todo;
