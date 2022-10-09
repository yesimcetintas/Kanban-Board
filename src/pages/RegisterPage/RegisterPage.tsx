import { useNavigate } from 'react-router-dom'
import { auth } from '../../services/http/endpoints/auth'
import RegisterForm from "../../components/RegisterForm"
import { RegisterFormProps } from '../../components/RegisterForm/RegisterForm.types'
import { useLoginContext } from '../../contexts/LoginContext/LoginContext'


const RegisterPage = () => {
  const navigate = useNavigate()
  const {login} = useLoginContext()
  const handleRegister: RegisterFormProps['onRegister'] = (values) => {
    auth.register(values).then(({data})=>{
      login(data.token,data.username)
      navigate('/')
    })
  }

  return <RegisterForm onRegister={handleRegister} />
}

export default RegisterPage