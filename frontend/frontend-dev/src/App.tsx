import React from "react";
import { Switch, Route } from "react-router-dom";
import LoginRedirect from "./components/Redirect/LoginRedirect";
import Contexts from "./contexts";

import { routesData } from "./routes";
import "./translations/i18n";

function App() {
  return (
    <Contexts>
      <div className="App">
        <LoginRedirect />
        <div>
          <Switch>
            {Object.entries(routesData).map(([uri, { props }], idx) => (
              <Route key={`route__${idx}`} {...props} />
            ))}
          </Switch>
        </div>
      </div>
    </Contexts>
  );
}

export default App;
