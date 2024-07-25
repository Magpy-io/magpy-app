import { usePermissionsContextInner } from './PermissionsContext';

export function usePermissionsContextFunctions() {}

export function usePermissionsContext() {
  const { hasMediaPermission } = usePermissionsContextInner();

  return { hasMediaPermission };
}
