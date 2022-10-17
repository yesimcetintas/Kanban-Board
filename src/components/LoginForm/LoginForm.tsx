import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import RegisterCard from "../RegisterCard"
import Checkbox from '../Checkbox'
import Input from '../Input/Input'
import { InputProps } from '../Input/Input.types'
import { Styled } from './LoginForm.styled'
import { LoginFormProps, LoginFormValuesProps } from './LoginForm.types'
import { Button } from 'antd';

const LoginForm: FC<LoginFormProps> = (props) => {
  const [formValues, setFormValues] = useState<LoginFormValuesProps>({
    username: '',
    password: '',
  })

  const handleChange: InputProps['onChange'] = (e, v) => {
    const name = e.target.name
    setFormValues((prev) => ({ ...prev, [name]: v }))
  }

  const handleSubmit = () => {
    props.onLogin?.(formValues)
  }
  return (
    <Styled>
      <RegisterCard title="Login">
        <Input
          onChange={handleChange}
          name="username"
          value={formValues.username}
          icon="person"
          type="text"
          placeholder="Enter your email"
          style={{ marginBottom: '15px' }}
        />
        <Input
          onChange={handleChange}
          name="password"
          value={formValues.password}
          icon="key"
          type="password"
          placeholder="Enter your password"
          style={{ marginBottom: '15px' }}
        />
        <div className="remember-forgot">
          <Checkbox label="Remember me" />
          <a href="#" className="link">
            Forgot password
          </a>
        </div>

        <Button onClick={handleSubmit}>Login now</Button>
        <p className="register-links">
          Don't have an account{' '}
          <Link className="link" to="/register">
            Sign up!
          </Link>
        </p>
      </RegisterCard>
    </Styled>
  )
}

export default LoginForm
