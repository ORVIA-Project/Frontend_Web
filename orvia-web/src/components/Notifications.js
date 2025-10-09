import { Drawer, Empty } from "antd";

export default function NotificationsDrawer({ open, onClose }) {
  return (
    <Drawer
      title="Notificaciones"
      placement="right"
      onClose={onClose}
      open={open}
      width={350}
    >
      <Empty
        description="Sinz notificaciones por ahora"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    </Drawer>
  );
}
