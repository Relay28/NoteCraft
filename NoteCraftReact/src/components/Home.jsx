import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import PrimarySearchAppBar from "./AppBar";
import SideBar from "./SideBar";
import { PersonalInfoContext } from './PersonalInfoProvider';

export default function Home() {
    const { personalInfo } = useContext(PersonalInfoContext);

    return (
        <div>
            <PrimarySearchAppBar personalInfo={personalInfo} />
            <SideBar personalInfo={personalInfo} />
            <Outlet context={personalInfo} />
        </div>
    );
}
