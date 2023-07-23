import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '../components/utils/Input';
import Loader from '../components/utils/Loader';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';
import './Task.css';

const Task = () => {
  const authState = useSelector(state => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? 'add' : 'update';
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === 'add' ? 'Add task' : 'Update Task';
  }, [mode]);

  useEffect(() => {
    if (mode === 'update') {
      const config = {
        url: `/tasks/${taskId}`,
        method: 'get',
        headers: { Authorization: authState.token }
      };
      fetchData(config, { showSuccessToast: false }).then(data => {
        setTask(data.task);
        setFormData({ description: data.task.description });
      });
    }
  }, [mode, authState, taskId, fetchData]);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = e => {
    e.preventDefault();
    setFormData({
      description: task.description
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields('task', formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(
        errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {})
      );
      return;
    }

    if (mode === 'add') {
      const config = {
        url: '/tasks',
        method: 'post',
        data: formData,
        headers: { Authorization: authState.token }
      };
      fetchData(config).then(() => {
        navigate('/');
      });
    } else {
      const config = {
        url: `/tasks/${taskId}`,
        method: 'put',
        data: formData,
        headers: { Authorization: authState.token }
      };
      fetchData(config).then(() => {
        navigate('/');
      });
    }
  };

  const fieldError = field =>
    formErrors[field] ? (
      <p className="error-message">
        <i className="fa-solid fa-circle-exclamation"></i>
        {formErrors[field]}
      </p>
    ) : null;

  return (
    <>
    
      <MainLayout>
      <div className="task-page">
        <form className="task-form">
          {loading ? (
            <Loader />
          ) : (
            <>
              <h2 className="task-title">{mode === 'add' ? 'Add New Task' : 'Edit Task'}</h2>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <Textarea
                  type="description"
                  name="description"
                  id="description"
                  value={formData.description}
                  placeholder="Write here.."
                  onChange={handleChange}
                />
                {fieldError('description')}
              </div>

              <button className="submit-button" onClick={handleSubmit}>
                {mode === 'add' ? 'Add task' : 'Update Task'}
              </button>
              <button className="cancel-button" onClick={() => navigate('/')}>
                Cancel
              </button>
              {mode === 'update' && (
                <button className="reset-button" onClick={handleReset}>
                  Reset
                </button>
              )}
            </>
          )}
        </form>
        </div>
      </MainLayout>
      
    </>
  );
};

export default Task;
