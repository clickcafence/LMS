import { NavbarRoutes } from "@/components/navbar-routes";
import { Logo } from "../(dashboard)/_components/logo";


const RequestTeacherLayout = ({ children}: {children: React.ReactNode}) => {
  
       return (
        <div className={`h-full border-r flex flex-col overflow-y-auto bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white`}>
        <div className="p-6">
                <Logo />
            </div>
            <div className="flex flex-col w-full">
          <NavbarRoutes />
            </div>
      
  
<main className="md:pl-56 pt-[80px] h-full">
{children}
</main>
</div>
       )
    }

    export default RequestTeacherLayout;