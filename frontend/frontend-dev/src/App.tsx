import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { routeNames, routeProps } from "./routes";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <ul>
              {Object.entries(routeNames).map(([uri, name], idx) => (
                <li>
                  <Link to={uri}>{name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <Switch>
            {routeProps.map((props, idx) => (
              <Route key={`route__${idx}`} {...props} />
            ))}
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
