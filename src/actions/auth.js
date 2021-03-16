import axios from 'axios'
import {message} from 'antd'

export const logout = (setLogin) => {
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('token');
    setLogin(false)
}

export const authLogin = (values,btnToggle, setLogin) => {
    axios.post(`${process.env.REACT_APP_BACKEND}/superusers/login`,values)
    .then(res=>{
        let token = res.data.token
        const expirationDate = new Date(new Date().getTime() + 3600*1000)
        localStorage.setItem('token', token)
        localStorage.setItem('expirationDate', expirationDate)
        setTimeout(() => {
            logout(setLogin);
        }, 3600*1000)
        btnToggle()
        setLogin(true)
        message.success("Authenticated")
    })
    .catch(err=>{
        console.log(err)
        message.error(err.response ? err.response.data.message : "Server Timed Out")
        btnToggle()
    })
}

export const authCheckState = (setLogin) => {
    let token = localStorage.getItem('token')
    if (!token) {
        logout(setLogin)
    } else {
        const expirationDate = new Date(localStorage.getItem('expirationDate'))
        if (expirationDate <= new Date()){
            logout(setLogin)
        } else {
            setTimeout(() => {
                logout(setLogin);
            }, expirationDate.getTime() - new Date().getTime())
            setLogin(true)
        }
    }
}
