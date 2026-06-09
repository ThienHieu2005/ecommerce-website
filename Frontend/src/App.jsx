import { useEffect } from "react";
import axios from "axios";
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import DefaultComponet from "./components/DefaultComponent/DefaultComponet";
import { routes } from "./routes/index";
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from "react-redux";
import { updateUser } from "./redux/slices/UserSlice";
import { useSelector } from "react-redux";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);


  useEffect(() => {

    let storageData = localStorage.getItem("user")
    const isJsonString = (str) => {
      try {
        JSON.parse(str)
        return true
      } catch (e) {
        return false
      }
    }
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      dispatch(updateUser(storageData));
    }
    console.log('storageData', storageData)
  }, [])

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            const isCheckAuth = !route.isPrivate || user.isAdmin
            const Layout = route.isShowHeader ? DefaultComponet : React.Fragment
            return (
              <Route key={route.path} path={route.path} element={
                isCheckAuth ? (
                  <Layout>
                    <Page />
                  </Layout>
                ) : (
                  <NotFoundPage />
                )
              } />
            )
          })}
        </Routes>
      </Router>
    </div>
  )
}

export default App