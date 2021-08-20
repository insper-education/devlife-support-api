import React from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import UserMenu from "./components/UserMenu";
import Contexts from "./contexts";

import { routeNames, routeProps, routes } from "./routes";
import "./translations/i18n";

function App() {
  const { t } = useTranslation();

  return (
    <Contexts>
      <div className="App">
        <Router>
          <div>
            <nav>
              <ul className="flex">
                {Object.entries(routeNames).map(([uri, name], idx) => (
                  <li key={`nav__${uri}`} className="ml-4">
                    <Link to={uri}>{t(name)}</Link>
                  </li>
                ))}
                <li className="ml-auto mr-4">
                  <UserMenu />
                </li>
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
    </Contexts>
  );
}

export default App;
