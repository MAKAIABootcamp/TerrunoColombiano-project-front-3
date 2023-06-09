import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { AiOutlineUser } from 'react-icons/ai'
import { BsPostcard } from 'react-icons/bs'
import { CiCoffeeBean, CiLogout } from 'react-icons/ci'

import './admin.scss'
import { ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import { logOutAsync } from '../../redux/actions/userActions'
import Loader from '../loader/Loader'

const Admin = () => {
    const [loading, setLoading] = useState(true);

    const { user } = useSelector(store => store.users)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {

        if (user) {
            if (user.type === "user") {
                navigate('/')

            }

        }

    }, [])
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);
    const logOut = () => {
        Swal.fire({
            icon: 'info',
            title: 'Estás seguro deseas cerrar sesión?',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,

        }).then((response) => {
            if (response.isConfirmed) {
                dispatch(logOutAsync())
                navigate('/login')

            }

        }).catch((error) => {
            console.log(error);
            Swal.fire({
                icon: 'success',
                title: 'Que bueno que no nos abandonaste :D'
            })

        })
    }

    return (
        <>
            {loading ? <Loader /> :
                <article className='admin'>
                    <aside>
                        <figure>
                            <img src={user.photo} alt="photo" />
                            <h4>{user.name}</h4>
                        </figure>

                        <small onClick={() => navigate('showPosts/all')}><BsPostcard />Ver publicaciones</small>
                        <small onClick={() => navigate('myAccount')}><AiOutlineUser />Mi cuenta</small>
                        <small onClick={() => navigate('/')}><CiCoffeeBean />Terruño Colombiano</small>
                        <small onClick={() => logOut()}><CiLogout />Cerrar sesión</small>

                    </aside>
                    <main>
                        <Outlet />


                    </main>
                    <ToastContainer />
                </article>}


        </>

    )
}

export default Admin