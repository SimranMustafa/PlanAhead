import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import validateManyFields from '../validations';
import Input from './utils/Input';
import Loader from './utils/Loader';
import './styles/SignupForm.css';

const SignupForm = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [fetchData, { loading }] = useFetch();
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields('signup', formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(
        errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {})
      );
      return;
    }

    const config = { url: '/auth/signup', method: 'post', data: formData };
    fetchData(config).then(() => {
      navigate('/login');
    });
  };

  const fieldError = field =>
    formErrors[field] ? (
      <p className="error-message">
        <i className="fa-solid fa-circle-exclamation"></i>
        {formErrors[field]}
      </p>
    ) : null;

  return (
    <div className="background-container">
      <div className="signup-form-container">
        <form className="signup-form">
          {loading ? (
            <Loader />
          ) : (
            <>
              <h2 className="form-title">Welcome user, please signup here</h2>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  placeholder="Your name"
                  onChange={handleChange}
                />
                {fieldError('name')}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  value={formData.email}
                  placeholder="youremail@domain.com"
                  onChange={handleChange}
                />
                {fieldError('email')}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  placeholder="Your password.."
                  onChange={handleChange}
                />
                {fieldError('password')}
              </div>

              <button className="submit-button" onClick={handleSubmit}>
                Submit
              </button>

              <div className="login-link">
                <Link to="/login" className="text-blue-400">
                  Already have an account? Login here
                </Link>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
