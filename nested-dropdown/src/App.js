import React, { useState } from "react";
import { Menu, Spin, Select } from "antd";
import './scrollbar.module.css'
const { SubMenu } = Menu;

const DynamicDropdown = () => {
  const [menuData, setMenuData] = useState([]);
  const [submenuData, setSubmenuData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingSubmenu, setLoadingSubmenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("");

  // Mock API call to fetch menu data
  const fetchMenuData = async () => {
    if (menuData.length === 0) {
      setLoading(true);
      try {
        // Simulate API response
        const data = await new Promise((resolve) =>
          setTimeout(
            () =>
              resolve([
                { key: "menu1", label: "Menu 1" },
                { key: "menu2", label: "Menu 2" },
              ]),
            1000
          )
        );
        setMenuData(data);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Mock API call to fetch submenu data
  const fetchSubmenuData = async (parentKey) => {
    setLoadingSubmenu(true);
    try {
      // Simulate API response
      const data = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve([
              { key: `${parentKey}-allItems`, label: "All Items" },
              { key: `${parentKey}-1`, label: `${parentKey} Submenu 1` },
              { key: `${parentKey}-2`, label: `${parentKey} Submenu 2` },
            ]),
          1000
        )
      );
      setSubmenuData((prev) => ({ ...prev, [parentKey]: data }));
    } catch (error) {
      console.error("Error fetching submenu data:", error);
    } finally {
      setLoadingSubmenu(false);
    }
  };

  // Trigger fetching menu data on component mount
  // React.useEffect(() => {
  //   fetchMenuData();
  // }, []);

  // Menu generator with dynamic submenu loading
  const menu = (
    <Menu
    className="menu-scrollable"
      triggerSubMenuAction="click"
      disabled={menuData.length === 0}
      style={{ border: "none", maxHeight: "50px", overflowY: "auto" }}
    >
      {menuData.length > 0 &&
        menuData.map((menuItem) => (
          <SubMenu
            key={menuItem.key}
            title={menuItem.label}
            onTitleClick={() => {
              if (!submenuData[menuItem.key]) {
                fetchSubmenuData(menuItem.key);
              }
            }}
          >
            {loadingSubmenu && !submenuData[menuItem.key] ? (
              <Menu.Item key={`${menuItem.key}-loading`}>
                <Spin size="small" />
              </Menu.Item>
            ) : (
              (submenuData[menuItem.key] || []).map((subItem) => (
                <Menu.Item
                  key={subItem.key}
                  onClick={(e) => {
                    const totalMenuData = [
                      ...menuData,
                      ...submenuData[menuItem.key],
                    ];
                    const selectedMenuData = totalMenuData.filter(
                      (item) =>
                        item.key === e.keyPath[0] || item.key === e.keyPath[1]
                    );
                    setSelectedMenu(
                      selectedMenuData?.[1]?.key?.includes("allItems")
                        ? `${selectedMenuData?.[0]?.label}/${selectedMenuData?.[1]?.label}`
                        : selectedMenuData?.[1]?.label
                    );
                  }}
                >
                  {subItem.label}
                </Menu.Item>
              ))
            )}
          </SubMenu>
        ))}
    </Menu>
  );

  return (
    <Select
      style={{ width: "200px" }}
      placeholder="Identifier"
      notFoundContent={loading ? "Loading..." : "No Data"}
      onDropdownVisibleChange={fetchMenuData}
      value={selectedMenu ? selectedMenu : undefined}
      onClear={() => setSelectedMenu([])}
      allowClear
      dropdownRender={() => {
        return loading ? "Loading" : menu;
      }}
      dropdownStyle={{ width: "200px" }}
      popupClassName="menu-scrollable"
    />
  );
};

export default DynamicDropdown;
