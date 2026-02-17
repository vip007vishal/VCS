import { useSimulation } from '../context/SimulationContext';
import { Role } from '../types';

export const usePermission = () => {
  const { currentUser } = useSimulation();

  const can = (action: string): boolean => {
    if (!currentUser) return false;
    
    // Admin has full access
    if (currentUser.role === Role.ADMIN) return true;

    const permissions: Record<Role, string[]> = {
      [Role.CEO]: [
        'manage_company', 
        'view_revenue', 
        'hire_staff', 
        'fire_staff',
        'change_methodology', 
        'view_all_stats',
        'access_meetings'
      ],
      [Role.MANAGER]: [
        'manage_team', 
        'assign_tasks', 
        'view_reports', 
        'promote_users',
        'view_performance_team',
        'access_meetings'
      ],
      [Role.USER]: [
        'view_tasks', 
        'submit_task',
        'edit_profile', 
        'join_meetings', 
        'request_verification',
        'view_own_performance'
      ],
      [Role.ADMIN]: [] // Handled above
    };

    return permissions[currentUser.role]?.includes(action) ?? false;
  };

  return { 
    can, 
    role: currentUser?.role,
    isAuthorized: (allowedRoles: Role[]) => currentUser && allowedRoles.includes(currentUser.role)
  };
};