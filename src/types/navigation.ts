export type SidebarMenuItem = {
  menuKey: string;
  menuLabel: string;
  route: string;
};

export type SidebarModule = {
  moduleKey: string;
  moduleLabel: string;
  menus: SidebarMenuItem[];
};

export type PageData = {
  title: string;
  subtitle: string;
  stats: Array<{ label: string; value: string }>;
  table: Array<{ id: string; name: string; type: string; status: string }>;
};
