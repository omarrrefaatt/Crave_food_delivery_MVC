import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./Routes/routes";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
