import { Card } from '../../components/ui/Card';

export function SettingsPage() {
  return (
    <>
      <h1 className="page-title">Settings</h1>
      <Card title="System Settings">
        <div className="alert">
          Next real build items: Google/Apple login, .NET API, database migrations, file storage, audit logs and role permissions.
        </div>
      </Card>
    </>
  );
}
