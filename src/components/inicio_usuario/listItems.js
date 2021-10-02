import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import { Link } from 'react-router-dom';
import SupplierIcon from '@material-ui/icons/DragHandleRounded';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import BarChartIcon from '@material-ui/icons/BarChart';
import AddReactionIcon from '@material-ui/icons/AccountCircleOutlined';

export const mainListItems = (
  <div>
    <ListItem button component={Link} to='/'>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Mi información" />
    </ListItem>
    <ListItem button component={Link} to='/admin/usuarios'>
      <ListItemIcon>
      <PersonAddIcon/>
      </ListItemIcon>
      <ListItemText primary="Usuarios" />
    </ListItem>
    <ListItem button component={Link} to='/admin/perfiles'>
      <ListItemIcon>
      <GroupAddIcon/>
      </ListItemIcon>
      <ListItemText primary="Perfiles" />
    </ListItem>
    <ListItem button component={Link} to='/admin/clientes'>
      <ListItemIcon>
      <AddReactionIcon/>
      </ListItemIcon>
      <ListItemText primary="Clientes" />
    </ListItem>
    <ListItem button component={Link} to='/proveedores'>
      <ListItemIcon>
      <SupplierIcon/>
      </ListItemIcon>
      <ListItemText primary="Proveedores" />
    </ListItem>
    <ListItem button component={Link} to='/materiales'>
      <ListItemIcon>
      <AccountBalanceIcon/>
      </ListItemIcon>
      <ListItemText primary="Materiales" />
    </ListItem>
    <ListItem button component={Link} to='/usuario/reportes'>
      <ListItemIcon>
      <BarChartIcon/>
      </ListItemIcon>
      <ListItemText primary="Reportes" />
    </ListItem>
  </div>
);
