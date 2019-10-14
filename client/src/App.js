import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";

import Login from "./components/Login";
import "./styles.scss";
import PrivateRoute from "./components/PrivateRoute";
import BubblePage from "./components/BubblePage";

function App() {
  const [colorList, setColorList] = useState([]);
  return (
    <Router>
      <div className="App">
        <Link to="/">Login</Link>
        <Link to="/bubbles">BubblePage</Link>

        <Switch>
          <Route exact path="/" component={Login} />
          <PrivateRoute exact path="/bubbles" component={BubblePage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
