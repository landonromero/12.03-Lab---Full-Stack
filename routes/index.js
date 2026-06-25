var express = require('express');
var router = express.Router();

function fetchTodos(req, res, callback) {
  req.db.query('SELECT * FROM todos ORDER BY id DESC;', (err, results) => {
    if (err) {
      console.error('Error fetching todos:', err);
      return res.status(500).send('Error fetching todos');
    }
    callback(results);
  });
}

/* GET home page. */
router.get('/', function(req, res, next){
  const message = req.query.message || null;
  try {
    fetchTodos(req, res, (results) => {
      res.render('index', { title: 'My Simple TODO', todos: results, message, editTodo: null });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

router.get('/edit/:id', function(req, res, next) {
  const { id } = req.params;
  const message = req.query.message || null;

  try {
    req.db.query('SELECT * FROM todos WHERE id = ?;', [id], (err, results) => {
      if (err) {
        console.error('Error fetching todo for edit:', err);
        return res.status(500).send('Error fetching todo for edit');
      }
      if (results.length === 0) {
        return res.redirect('/?message=Task+not+found');
      }
      fetchTodos(req, res, (todos) => {
        res.render('index', { title: 'My Simple TODO', todos, message, editTodo: results[0] });
      });
    });
  } catch (error) {
    console.error('Error entering edit mode:', error);
    res.status(500).send('Error entering edit mode');
  }
});

router.post('/create', function (req, res, next) {
    const task = req.body.task && req.body.task.trim();
    if (!task) {
      return res.redirect('/?message=Task+cannot+be+blank');
    }

    try {
      req.db.query('INSERT INTO todos (task) VALUES (?);', [task], (err, results) => {
        if (err) {
          console.error('Error adding todo:', err);
          return res.status(500).send('Error adding todo');
        }
        console.log('Todo added successfully:', results);
        res.redirect('/');
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      res.status(500).send('Error adding todo');
    }
});

router.post('/update', function (req, res, next) {
    const { id } = req.body;
    const task = req.body.task && req.body.task.trim();
    const completed = req.body.completed ? 1 : 0;

    if (!task) {
      return res.redirect('/edit/' + id + '?message=Task+cannot+be+blank');
    }

    try {
      req.db.query('UPDATE todos SET task = ?, completed = ? WHERE id = ?;', [task, completed, id], (err, results) => {
        if (err) {
          console.error('Error updating todo:', err);
          return res.status(500).send('Error updating todo');
        }
        console.log('Todo updated successfully:', results);
        res.redirect('/');
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).send('Error updating todo');
    }
});

router.post('/toggle', function (req, res, next) {
    const { id } = req.body;
    try {
      req.db.query('UPDATE todos SET completed = IF(completed, 0, 1) WHERE id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error toggling todo status:', err);
          return res.status(500).send('Error toggling todo status');
        }
        console.log('Todo toggled successfully:', results);
        res.redirect('/');
      });
    } catch (error) {
      console.error('Error toggling todo status:', error);
      res.status(500).send('Error toggling todo status');
    }
});

router.post('/delete', function (req, res, next) {
    const { id } = req.body;
    try {
      req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error deleting todo:', err);
          return res.status(500).send('Error deleting todo');
        }
        console.log('Todo deleted successfully:', results);
        // Redirect to the home page after deletion
        res.redirect('/');
    });
    }catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Error deleting todo:');
    }
});

module.exports = router;
