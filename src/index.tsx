import React from 'react';
import ReactDom from 'react-dom/client';
import { ToDoListComponent } from './components/ToDoListComponent/to-do-list.component';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.scss'
import { AuthComponent } from './components/AuthComponent/auth.component';

const rooter = ReactDom.createRoot(document.getElementById('root')!);
rooter.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<AuthComponent />} />
            <Route path='/sign-up' element={<AuthComponent />} />
            <Route path='/list' element={<ToDoListComponent />}></Route>
        </Routes>
    </BrowserRouter>
);
