import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginRedirect from "./components/Redirect/LoginRedirect";
import Contexts from "./contexts";

import { routesData } from "./routes";
import "./translations/i18n";

function App() {
  return (
    <Contexts>
      <div className="App">
        <Router>
          <LoginRedirect />
          <div>
            <Switch>
              {Object.entries(routesData).map(([uri, { props }], idx) => (
                <Route key={`route__${idx}`} {...props} />
              ))}
            </Switch>
          </div>
        </Router>
      </div>
    </Contexts>
  );
}

export default App;
