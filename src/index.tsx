import React from 'react';
import ReactDom from 'react-dom/client';
import { ToDoListComponent } from './components/ToDoListComponent/to-do-list.component';

import './index.scss'

const rooter = ReactDom.createRoot(document.getElementById('root')!);
rooter.render(<ToDoListComponent />);