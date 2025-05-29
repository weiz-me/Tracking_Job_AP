import Home from "../pages/Home";
import Jobs from "../pages/Jobs";
// import Account from "../pages/Account";
import Admin from "../pages/Admin";
import Register from "../pages/Register";
import Login from "../pages/Login";

export const navLinks = [
    {
      id: "home",
      title: "Home",
      path:"",
      component: <Home />
    },
    {
      id: "jobs",
      title: "Jobs",
      path:"jobs",
      component: <Jobs />
    },
    {
      id: "admin",
      title: "Admin",
      path:"admin",
      component: <Admin />
    },
  ];

  export const logreg=[
    {
      path:"login",
      component:<Login />
    },
    {
      path:"register",
      component:<Register />

    }

  ];