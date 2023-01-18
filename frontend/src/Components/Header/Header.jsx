import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { SideBarOpenCloseContext } from '../../context/SideBarOpenClose';
import {
    Home,
    HomeOutlined,
    Add,
    AddOutlined,
    SearchOutlined,
    Search,
    AccountCircle,
    AccountCircleOutlined,
} from "@mui/icons-material";
import './Header.css'

function Header() {
    const [tab, setTab] = useState(window.location.pathname)
    const { toggle, sideBarMode } = useContext(SideBarOpenCloseContext)

    return (
        <div className='header'>
            <h5>PEtbOOK</h5>
            <Link to={'/'} onClick={() => { setTab("/") }}>
                {tab === "/" ? < Home style={{ color: "white" }} /> : <HomeOutlined />}
            </Link>

            <Link to={'/newpost'} onClick={() => { setTab("/newpost") }} >
                {tab === "/newpost" ? < Add style={{ color: "white" }} /> : <AddOutlined />}
            </Link>

            <Link to={'/search'} onClick={() => { setTab("/search") }}>
                {tab === "/search" ? < Search style={{ color: "white" }} /> : <SearchOutlined />}
            </Link>

            <Link to={'/account'} onClick={() => { setTab("/account") }}>
                {tab === "/account" ? < AccountCircle style={{ color: "white" }} /> : <AccountCircleOutlined />}
            </Link>
            <button className='btn-sidebar' onClick={toggle}>
                <div className='line'></div>
                <div className='line'></div>
                <div className='line'></div>
            </button>

        </div>
    )
}

export default Header