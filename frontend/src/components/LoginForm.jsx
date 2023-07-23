import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validateManyFields from '../validations';
import Input from './utils/Input';
import { useDispatch, useSelector } from 'react-redux';
import { postLoginData } from '../redux/actions/authActions';
import Loader from './utils/Loader';
import { useEffect } from 'react';
import './styles/LoginForm.css';

const LoginForm = ({ redirectUrl }) => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const authState = useSelector((state) => state.authReducer);
  const { loading, isLoggedIn } = authState;
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectUrl || '/');
    }
  }, [authState, redirectUrl, isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields('login', formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(
        errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {})
      );
      return;
    }
    dispatch(postLoginData(formData.email, formData.password));
  };

  const fieldError = (field) =>
    formErrors[field] ? (
      <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? 'block' : 'hidden'}`}>
        <i className='mr-2 fa-solid fa-circle-exclamation'></i>
        {formErrors[field]}
      </p>
    ) : null;

  return (
    <>
      <div className="background-group">
      <div className="login-form-container">
      
      <form className='login-form'>
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className='form-title'>Welcome user, please login here</h2>
          
              <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <Input
                type='text'
                name='email'
                id='email'
                value={formData.email}
                placeholder='youremail@domain.com'
                onChange={handleChange}
              />
              {fieldError('email')}
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <Input
                type='password'
                name='password'
                id='password'
                value={formData.password}
                placeholder='Your password..'
                onChange={handleChange}
              />
              {fieldError('password')}
            </div>

            <button className='submit-button' onClick={handleSubmit}>
              Submit
            </button>

            <div className='signup-link'>
              <Link to='/signup' className='text-blue-400'>
                Don't have an account? Signup here
              </Link>
            </div>
          </>
        )}
      </form>
    </div>
    </div>
    </>
  );
};

export default LoginForm;
