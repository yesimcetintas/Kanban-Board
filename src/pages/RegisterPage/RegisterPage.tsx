import { useNavigate } from 'react-router-dom'
import { auth } from '../../services/http/endpoints/auth'
import RegisterForm from "../../components/RegisterForm"
import { RegisterFormProps } from '../../components/RegisterForm/RegisterForm.types'


const RegisterPage = () => {
  const navigate = useNavigate()
  const handleRegister: RegisterFormProps['onRegister'] = (values) => {
    auth.register(values).then(({data})=>{
      navigate('/')
    })
  }

  return <RegisterForm onRegister={handleRegister} />
}

export default RegisterPage