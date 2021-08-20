import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import UserMenu from "../../components/UserMenu";
import { useUser } from "../../contexts/user-context";
import { navRoutes, routesData } from "../../routes";

const Header = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  return (
    <nav className="py-2 px-4 bg-primary text-white">
      <ul className="flex items-center">
        <li className="uppercase font-bold">
          <Link to="/">{t("Developer Life")}</Link>
        </li>
        {navRoutes.map((uri) => {
          const routeData = routesData[uri];
          if (routeData.permissionTest && !routeData.permissionTest(user))
            return null;
          const title = routeData.title;
          return (
            <li key={`nav__${uri}`} className="ml-4">
              <Link to={uri}>{t(title)}</Link>
            </li>
          );
        })}
        <li className="ml-auto">
          <UserMenu />
        </li>
      </ul>
    </nav>
  );
};

export default Header;
