import React from 'react';
import ReactDom from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.scss'
import { AuthComponent } from './components/AuthComponent/auth.component';
import { AuthProvider } from './context/AuthProvider';
import RequireAuthComponent from './components/RequireAuthComponent/requireAuthComponent';
import ToDoListWithHookComponent from './components/ToDoListWithHooks/to-do-list-with-hook.component';

const rooter = ReactDom.createRoot(document.getElementById('root')!);
rooter.render(
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path='/' element={<AuthComponent />} />
                <Route path='/sign-up' element={<AuthComponent />} />
                <Route element={<RequireAuthComponent />}>
                    <Route path='/list' element={<ToDoListWithHookComponent />} />
                </Route>
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);
