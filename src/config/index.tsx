import { CircularProgress } from "@mui/material";
import { ReactNode, Suspense } from "react";

export const Loading = () => {
    return  <div className="w-full h-screen flex items-center justify-center">
        <CircularProgress />
    </div>
}

export const SuspenseContainer = ({children}:{children: ReactNode}) => {
    return <Suspense fallback={<Loading/>}>{children}</Suspense>
}