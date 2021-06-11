import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import { Link } from 'react-router-dom';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import BarChartIcon from '@material-ui/icons/BarChart';

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
    <ListItem button component={Link} to='/admin/productos'>
      <ListItemIcon>
      <AddAPhoto/>
      </ListItemIcon>
      <ListItemText primary="Producto" />
    </ListItem>
    <ListItem button component={Link} to='/admin/restaurantes'>
      <ListItemIcon>
      <RestaurantIcon/>
      </ListItemIcon>
      <ListItemText primary="Restaurantes" />
    </ListItem>
    <ListItem button component={Link} to='/admin/bancos'>
      <ListItemIcon>
      <AccountBalanceIcon/>
      </ListItemIcon>
      <ListItemText primary="Bancos" />
    </ListItem>
    <ListItem button component={Link} to='/usuario/reportes'>
      <ListItemIcon>
      <BarChartIcon/>
      </ListItemIcon>
      <ListItemText primary="Reportes" />
    </ListItem>
  </div>
);
