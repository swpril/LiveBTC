import React from 'react';

const Navbar = ({ brand = 'Live BTC Tracker' }) => {
    return (
        <nav className='navbar mb-3 pt-3 pb-3 py-0 text-sm-center text-md-left'>
            <div className='container'>
                <a href='/' className='navbar-brand'>
                    {brand}
                </a>
            </div>
        </nav>
    )
}

export default Navbar;