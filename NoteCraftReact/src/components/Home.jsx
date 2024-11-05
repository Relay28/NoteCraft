// import React, { useEffect } from 'react';
// import { useLocation, useNavigate, Outlet } from 'react-router-dom';
// import NestedList from "./SideBar";
// import Note from "./Note";
// import PrimarySearchAppBar from "./AppBar";

// export default function Home() {
//     const location = useLocation();
//     const navigate = useNavigate();
    
//     // Get account data from location.state or set default values
//     const personalInfo = location.state?.account || { id: '', username: '', email: '' };  


//     // useEffect(() => {
//     //     // Check if personalInfo has valid username and id
//     //     if (!personalInfo.username || !personalInfo.id) {
//     //         console.warn("No user data available, redirecting to login.");
//     //         navigate('/login'); // Redirect to login if no user data
//     //     }
//     // }, [personalInfo]);

//     return (
//         <div>
//             <PrimarySearchAppBar personalInfo={personalInfo} /> {/* Pass personalInfo as prop */}
//             <NestedList sx={{ maxWidth: '20%' }} />
//             <Note />
//             <Outlet context={personalInfo} />
//         </div>
//     );
// }

import React, { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import NestedList from "./SideBar";
import Note from "./Note";
import NoteForm from "./NoteForm";
import PrimarySearchAppBar from "./AppBar";

export default function Home() {
    const location = useLocation();
    const navigate = useNavigate();

    // Get account data from location.state or set default values
    const personalInfo = location.state?.account || { id: '', username: '', email: '' };  

    return (
        <div>
            <PrimarySearchAppBar personalInfo={personalInfo} /> {/* Pass personalInfo as prop */}
        
            <Outlet context={personalInfo} />
        </div>
    );
}
