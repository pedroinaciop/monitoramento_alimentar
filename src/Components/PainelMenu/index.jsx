import { FileOutlined, UserOutlined, HomeOutlined, SolutionOutlined, LogoutOutlined } from '@ant-design/icons'
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StraightenIcon from '@mui/icons-material/Straighten';
import { Layout, Menu, Avatar, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled from "./PainelMenu.module.css";
import { enqueueSnackbar } from 'notistack';
const { Sider } = Layout;

function getItem(label, key, icon, children, pathname) {
  return {
    key,
    icon,
    children,
    label,
    pathname
  };
}

const items = [
  getItem('Home', '1', <HomeOutlined />, null, '/home'),
  getItem('Minhas Informações', '2', <SolutionOutlined />, null, '/info/usuario/'),
  getItem('Registrar Medidas', '3', <StraightenIcon />, null, '/medidas'),
  getItem('Registrar Refeições', '4', <RestaurantIcon />, null, '/refeicao'),
  getItem('Relatórios', '5', <FileOutlined />, null, "/relatorios")
];

const PainelMenu = () => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("user");
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = (e) => {
    const item = e.item;
    if (item.pathname) {
      navigate(item.pathname);
    }
  };

  const mapItems = (items) => {
    return items.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: item.children ? mapItems(item.children) : undefined,
      onClick: () => handleClick({ item }),
    }));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/login"); 
    enqueueSnackbar('Usuário desconectado', { variant: 'info', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } });
  };

  return (
    <Sider 
      className={styled.sider}  
      breakpoint="lg" 
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      collapsedWidth="50"
    >
      <Space className={styled.userData} direction="vertical">
        { collapsed ? (
          <>
            <Avatar size={32} icon={<UserOutlined />} />
            <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
            </Button>
          </>
          ) : (
            <>
              <Avatar size={64} icon={<UserOutlined />} />
              <p className={styled.userName}>{user}</p>
              <Button className={styled.logoutButton} type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
                  Desconectar
              </Button>
            </>
          )
        }
      </Space>
      <Menu 
        className={styled.menuItems}
        theme="dark" 
        mode="inline" 
        defaultSelectedKeys={['1']} 
        items={mapItems(items)}/>
    </Sider>
  );
};

export default PainelMenu;
