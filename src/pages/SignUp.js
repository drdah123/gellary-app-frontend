import React, { useState, useContext, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../queries';
import Error from '../components/Error';
import Spinner from '../components/Spinner';
import AuthContext from '../context/auth-context';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage() {
  const [alerts, setAlerts] = useState([]);
  const value = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    if (name.trim().length < 3) alerts.push('يجب ان يكون الاسم 3 حروف فاكثر');
    if (password.trim().length < 6)
      alerts.push('كلمة السر يجب ان تطون اكثر من 6 احرف');

    if (alerts.length > 0) {
      setAlerts([...alerts]);
      setTimeout(() => setAlerts([]), 5 * 1000);
      return;
    }

    signup({
      variables: {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      },
    });
  }

  const [signup, { loading, error, data }] = useMutation(CREATE_USER, {
    onError: (error) => setAlerts((prev) => [...prev, error.message]),
    onCompleted: () => setAlerts((prev) => [...prev, 'تم إنشاء الحساب بنجاح']),
  });

  useEffect(() => {
    if (!loading && data) {
      const token = data.createUser.token;
      const userId = data.createUser.userId;
      const name = data.createUser.name;
      value.login(token, userId, name);
    }
  }, [data, loading]);

  if (loading) return <Spinner />;
  if (error) return error.message;

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      {alerts?.map((msg) => (
        <Error error={msg} />
      ))}
      <div className="mb-3 mt-2 ">
        <label className="form-label" htmlFor="name">
          اسم المستخدم
        </label>
        <input
          className="form-control"
          id="name"
          type="text"
          minLength={3}
          value={name}
          onChange={({ target }) => setName(target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="email">
          البريد الالكتروني
        </label>
        <input
          className="form-control"
          id="email"
          type="email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="password">
          كلمة المرور
        </label>
        <input
          className="form-control"
          id="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          type="password"
          required
          minLength="6"
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn">
          إرسال
        </button>
        <button className="btn" onClick={() => navigate('/login')}>
          انتقل إلى تسجيل الدخول
        </button>
      </div>
    </form>
  );
}
