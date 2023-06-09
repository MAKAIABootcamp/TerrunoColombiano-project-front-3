import React, { useState } from 'react'
import { BsFillHeartFill } from 'react-icons/bs'
import { AiOutlineUser } from 'react-icons/ai'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { AiOutlineHome } from 'react-icons/ai'
import { CiLogout } from 'react-icons/ci'
import { BsChevronDown } from 'react-icons/bs'
import { RiAdminLine } from 'react-icons/ri'
import { MdWorkspacesFilled } from 'react-icons/md'
import logo from '../../assets/cafe.svg'
import name from '../../assets/terruño.svg'
import hamburguer from '../../assets/icon-hamburger.svg'
import iconClose from '../../assets/icon-close.svg'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import './navbar.scss'
import { logOutAsync } from '../../redux/actions/userActions'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'

const Navbar = () => {
    const [menu, setMenu] = useState('hidden')
    const [close, setClose] = useState('closeMenu')
    const [open, setOpen] = useState('')
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.users)


    const openMenu = (icon) => {
        if (icon === "hamburguer") {
            setMenu('closeMenu')
            setClose('hidden')
            setOpen('open')

        }
        else {
            setMenu('hidden')
            setClose('closeMenu')
            setOpen('')
        }

    }
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
                // dispatch(toggle_loading())
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


    const navigate = useNavigate()
    return (
        <>
            <header>
                <figure onClick={() => navigate('/')}>
                    <img src={logo} alt="logo" />
                    <img src={name} alt="terruño" />
                </figure>
                <nav className={open} >
                    <ul>
                        <img src={iconClose} alt="cerrar" className={close} onClick={() => openMenu("close")} />
                        <NavLink to='/' className='navlink'><AiOutlineHome /> Inicio</NavLink>
                        <NavLink to='newPlace/addPlace' className='navlink'><MdWorkspacesFilled /> Mis lugares </NavLink>
                        <NavLink to='foro' className='navlink'><HiOutlineUserGroup /> Foro</NavLink>
                        <NavLink to='favorites' className='navlink'><BsFillHeartFill className='heart' /> Favoritos</NavLink>
                        {user?.type === "user" ? <NavLink to='user' className='navlink'><AiOutlineUser /> Cuenta</NavLink> : ''}
                        {user?.type === "admin" ? <NavLink to='admin/showPosts/all' className='navlink'><RiAdminLine /> Admin</NavLink> : ''}
                        <button onClick={() => logOut()}><CiLogout /> Salir</button>

                    </ul>


                </nav>
                <img src={hamburguer} alt="menu" className={menu} onClick={() => openMenu("hamburguer")} />
            </header>
            <Outlet />
        </>

    )
}

export default Navbar