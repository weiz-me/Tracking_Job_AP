import React from 'react';
import styles from '../styles'; // Adjust if styles file is elsewhere
import { navLinks,logreg } from "../constants";
import logo from "../assets/logo.png";
import {Link,Route, Routes} from "react-router-dom";

const Navbar = () => {

    return (
        <div>
        <nav className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary`} style={{ borderBottom: '2px solid black', padding: '0px 3px 10px 3px', }}>
            <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>

                <Link
                    to='/'
                    className='flex items-center gap-2'
                    >
                    <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
                        <img src={logo} alt="logo" className='w-9 h-9 object-contain' style={{filter: 'invert(1)'}}/>
                        <p className='text-black text-[18px] font-bold cursor-pointer flex '>
                            Project &nbsp;
                            <span className='sm:block hidden'> | Tracking</span>
                        </p>

                    </div>
                </Link>

                <ul className='list-none hidden sm:flex flex-row gap-10'>
                {navLinks.map((nav) => (
                    <li
                    key={nav.id}
                    className={`text-secondary hover:text-cyan text-[18px] font-medium cursor-pointer`}
                    >
                    <Link to={`/${nav.path}`}>{nav.title}</Link>
                    </li>
                ))}

                </ul>
            </div>
        </nav>

        <Routes>
            {navLinks.map((nav) => (
                <Route path={`/${nav.path}`} element={nav.component} />
            ))}
            {logreg.map((log) => (
                <Route path={`/${log.path}`} element={log.component} />
            ))}
        </Routes>

        </div>
        
    );
}

export default Navbar;
