function Home({children, redirect, title} : {children: React.ReactNode, redirect: string, title: string }) {
    return (
        <div className="relative flex h-screen py-20 px-5 w-full items-center justify-center">
            <div className="absolute inset-0 bg-[url('/pattern1.png')] bg-cover bg-center" />
            <div className="flex flex-col w-full h-full gap-4 justify-center items-center relative z-10 max-w-md">

            </div>
        </div>
    )
}

export default Home