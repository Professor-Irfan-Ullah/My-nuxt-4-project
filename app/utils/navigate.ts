// export const navigateUserByRole = (user: any) => {
//   // If user is missing, don't just "navigateTo", return it
//   if (!user) return navigateTo('/login', { replace: true })
//   let path = '/dashboard'
//   if (user.role === 'admin') path = '/admin/dashboard'
//   if (user.role === 'manager') path = '/manager/reports'
//   if(user.role === 'user') path = '/user/dashboard';

//   return navigateTo(path, { replace: true })
// }
// utils/navigation.js
export const getRoleBasedPath = (user:any) => {
  if (!user) return '/login';
  
  let path = '/';
  if (user.role === 'admin') path = '/admin/dashboard';
  if (user.role === 'super_admin') path = '/admin/dashboard';
  if(user.role === 'user') path = '/user/dashboard'
  
  return path; // Return just the path, not navigateTo
}

export const navigateUserByRole = (user:any) => {
  const path = getRoleBasedPath(user);
  // const router = useRouter();
  // return router.push(path)
  return navigateTo(path, { replace: true });
}