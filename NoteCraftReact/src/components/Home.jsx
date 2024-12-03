import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import PrimarySearchAppBar from "./AppBar";
import SideBar from "./SideBar";
import { PersonalInfoContext } from './PersonalInfoProvider';

export default function Home() {
    const { personalInfo } = useContext(PersonalInfoContext);
    const navigate = useNavigate();
    //Comment Out Sa nako since wala pa na connect tanan sa User - Duque hehe
    // useEffect(() => {
      
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         navigate('/login');  // Redirect to login if not authenticated
    //     }
    // }, [navigate]);

    return (
        <div>
           I try to put sidebar and appbar here so that login and regsiter wont be affeced but is tha the right solutiion?
           So Far So good
           In Progress...
            <Outlet context={personalInfo} />
        </div>
    );
}
