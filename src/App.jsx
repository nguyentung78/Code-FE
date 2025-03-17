import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Routes } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
// import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home'
import Register from './pages/Register'
import Product from './pages/Product'
import Detail from './pages/Detail'
function App() {


  return (
    <Routes>
      <Route path='' element={<DefaultLayout />}>
        <Route index element={<Home />}></Route>
        <Route path='product-detail/:id' element={<Detail />}></Route>
        <Route path='product' element={<Product />}></Route>
      </Route>
      <Route path='/register' element={<Register />}></Route>
    </Routes>
  )
}

export default App
