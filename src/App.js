import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Todo from './Todo';
import { db } from './firebase';
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  setDoc,
  orderBy,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 max-w-[500px] w-full m-auto rounded-md shadow-xl p-4`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl`,
  button: `border p-4 ml-2 bg-purple-500 text-slate-100`,
  count: `text-center p-2`,
};

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editTodo, setEditTodo] = useState({
    todo: {},
    edit: false
  });

  const updateTodo = (todo) => {
    setEditTodo({
      todo,
      edit: true
    })
  }

  useEffect(() => {
    // console.log(editTodo);
    if(editTodo.edit === true) {
      setInput(editTodo.todo.text)
    }
  }, [editTodo])

  // Create todo

  const createTodo = async (e) => {
    e.preventDefault();

    if (input === '') {
      alert('Please enter a valid todo');
      return;
    }
    editTodo.edit === false ? create() : update(editTodo.todo);
  };

  const create =async () => {
    await addDoc(collection(db, 'todos'), {
      text: input,
      completed: false,
      timestamp: new Date()
    });
    setInput('');
  }

  // Read todo from firebase
  useEffect(() => {
    const q = query(collection(db, 'todos'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);

  // Update todo in firebase
  const update = async (edits) => {
    console.log(edits);
    await setDoc(doc(db, 'todos', edits.id), {
      text: input,
      completed: false,
      timestamp: edits.timestamp
    });
    setInput('');
    editTodo.edit = false;
  };

  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed,
    });
  };

  // Delete todo
  const deleteTodo = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
    return await deleteDoc(doc(db, 'todos', id));
    }
  };
  let msg;
  if(todos.length === 1) {
    msg = 'todo'
  } else {
    msg = 'todos'
  }

  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h3 className={style.heading}>Todo App</h3>
        <form onSubmit={createTodo} className={style.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={style.input}
            type='text'
            placeholder='Add Todo'
          />
          <button className={style.button}>
            <AiOutlinePlus size={30} />
          </button>
        </form>
        <ul>
          {todos.map((todo, index) => (
            <Todo
              key={index}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
            />
          ))}
        </ul>
        {todos.length < 1 ? null : (
          <p className={style.count}>{`You have ${todos.length} ${msg}`}</p>
        )}
      </div>
    </div>
  );
}

export default App;
