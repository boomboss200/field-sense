import { faPage4, faWindows } from "@fortawesome/free-brands-svg-icons";
import {
  faTachometer,
  faTable,
  faLock,
  faNoteSticky,
  faNotdef,
  faUser,
  faMap,
  faVectorSquare,
  faDroplet,
  faDumpster,
  faRecycle,
  faTrash,
  faCow
} from "@fortawesome/free-solid-svg-icons";

const initMenu = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: faTachometer,
  },
  {
    label: 'Fields'
  },
  {
    label: " Add Field",
    path: "/mapcomp",
    icon: faMap,
  },
  {
    label: "My Fields",
    path: "/404",
    icon: faVectorSquare,
  },
  
  {
    label: 'Management'
  },
  {
    label: "Farm",
    path: "/farm",
    icon: faCow,
  },
  {
    label: "Season",
    path: "/season",
    icon: faDroplet,
  },
  {
    label: "Trash",
    path: "/trash",
    icon: faTrash,
  },

  {
    label: 'User'
  },
  {
    label: "Profile",
    path: "/profile",
    icon: faUser,
  },
  
  
];

export default initMenu