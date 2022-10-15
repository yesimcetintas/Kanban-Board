import service from '../../instance'


export const userList = ()  => service.get("user")