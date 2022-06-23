import MenuManager from "../components/ui/menu-manager";
import GroupManager from "../components/auth/group-manager";
import UserManager from "../components/auth/user-manager";
import Dashboard from "../components/dashboard";
import Notification from "../components/ui/notification";



const routes = {
    menus: <MenuManager/>,
    groups: <GroupManager/>,
    users: <UserManager/>,
    dashboard: <Dashboard/>,
    notifications: <Notification/>,
}

const combineRoute = (backendRoutes) => {
    return backendRoutes.map(r => {
        r.element = routes[r.path];
        if (r.children.length > 0) {
            r.children.map(rc => {
                rc.element = routes[rc.path];
                return rc;
            })
        }
        return r;
    })


}


export const combineRoutes = combineRoute;

export default routes;


