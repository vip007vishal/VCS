import { useSimulation } from '../context/SimulationContext';
import { Role } from '../types';

export const useRole = () => {
    const { currentUser } = useSimulation();

    const isRole = (role: Role) => currentUser?.role === role;
    const hasRole = (roles: Role[]) => currentUser && roles.includes(currentUser.role);
    
    return {
        role: currentUser?.role,
        isUser: isRole(Role.USER),
        isManager: isRole(Role.MANAGER),
        isCEO: isRole(Role.CEO),
        isAdmin: isRole(Role.ADMIN),
        hasRole
    };
};
